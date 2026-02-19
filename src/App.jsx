import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  :root{
    --sage:#7AAE9E; --sage-light:#A8CFC3; --sage-pale:#D4ECE6;
    --sky:#6BA3BE; --sky-light:#A8CADB; --sky-pale:#D8EBF4;
    --cream:#F7FAF9; --text-dark:#2C3E35; --text-mid:#4A6358; --text-soft:#7A9B8A;
    --peach:#F2A97E; --peach-soft:#FAD9C4; --lavender-soft:#E8E0F0;
  }
  body{font-family:'Nunito',sans-serif;background:var(--cream);color:var(--text-dark);overflow-x:hidden;}

  .bg-canvas{position:fixed;inset:0;z-index:0;background:linear-gradient(135deg,#EAF6F2 0%,#D8EBF4 40%,#EAF0F6 70%,#F4EDF7 100%);overflow:hidden;}
  .bg-blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:0.4;animation:floatBlob 14s ease-in-out infinite;}
  .bg-blob:nth-child(1){width:420px;height:420px;background:var(--sage-pale);top:-100px;left:-80px;animation-delay:0s;}
  .bg-blob:nth-child(2){width:320px;height:320px;background:var(--sky-pale);top:30%;right:-60px;animation-delay:-5s;}
  .bg-blob:nth-child(3){width:260px;height:260px;background:var(--peach-soft);bottom:10%;left:20%;animation-delay:-9s;}
  .bg-blob:nth-child(4){width:200px;height:200px;background:#E8E0F0;bottom:-40px;right:15%;animation-delay:-3s;}
  @keyframes floatBlob{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(20px,-30px) scale(1.05)}66%{transform:translate(-15px,20px) scale(0.97)}}

  .app-shell{position:relative;z-index:1;min-height:100vh;}

  /* NAV */
  .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:rgba(255,255,255,0.75);backdrop-filter:blur(16px);border-bottom:1px solid rgba(122,174,158,0.18);position:sticky;top:0;z-index:100;}
  .nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;}
  .logo-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--sage),var(--sky));border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 12px rgba(122,174,158,0.3);}
  .logo-text{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--text-dark);line-height:1.1;}
  .logo-sub{font-size:10px;font-weight:500;color:var(--text-soft);letter-spacing:0.08em;text-transform:uppercase;}
  .nav-tabs{display:flex;gap:5px;background:rgba(212,236,230,0.4);border-radius:50px;padding:4px;}
  .nav-tab{padding:7px 14px;border-radius:50px;border:none;background:transparent;font-family:'Nunito',sans-serif;font-size:13px;font-weight:600;color:var(--text-mid);cursor:pointer;transition:all 0.2s;white-space:nowrap;}
  .nav-tab:hover{background:rgba(255,255,255,0.6);color:var(--text-dark);}
  .nav-tab.active{background:white;color:var(--sage);box-shadow:0 2px 8px rgba(0,0,0,0.08);}
  .nav-cta{padding:8px 18px;background:linear-gradient(135deg,var(--sage),var(--sky));color:white;border:none;border-radius:50px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(107,163,190,0.35);transition:all 0.2s;}
  .nav-cta:hover{transform:translateY(-1px);}

  @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  @keyframes checkPop{0%{transform:scale(0)}60%{transform:scale(1.3)}100%{transform:scale(1)}}
  @keyframes strikeThrough{from{width:0}to{width:100%}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}

  /* BUTTONS */
  .btn-primary{padding:13px 26px;background:linear-gradient(135deg,var(--sage),var(--sky));color:white;border:none;border-radius:50px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 5px 18px rgba(122,174,158,0.38);transition:all 0.22s;display:inline-flex;align-items:center;gap:7px;}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(122,174,158,0.45);}
  .btn-primary:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
  .btn-ghost{padding:11px 20px;background:rgba(255,255,255,0.8);color:var(--text-mid);border:1.5px solid rgba(122,174,158,0.28);border-radius:50px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;backdrop-filter:blur(6px);}
  .btn-ghost:hover{border-color:var(--sage);color:var(--sage);background:white;}
  .btn-sm{padding:7px 14px;font-size:12px;}

  /* FORM */
  .text-input{width:100%;padding:11px 15px;border:1.5px solid rgba(122,174,158,0.25);border-radius:13px;font-family:'Nunito',sans-serif;font-size:14px;color:var(--text-dark);background:white;outline:none;transition:border-color 0.2s;}
  .text-input:focus{border-color:var(--sage);box-shadow:0 0 0 3px rgba(122,174,158,0.12);}
  .text-input::placeholder{color:rgba(122,155,138,0.55);}
  .chip{padding:7px 15px;border-radius:50px;border:1.5px solid rgba(122,174,158,0.25);background:white;font-family:'Nunito',sans-serif;font-size:13px;font-weight:600;color:var(--text-mid);cursor:pointer;transition:all 0.2s;user-select:none;}
  .chip:hover{border-color:var(--sage);color:var(--sage);}
  .chip.selected{background:linear-gradient(135deg,var(--sage-pale),var(--sky-pale));border-color:var(--sage);color:var(--sage);font-weight:700;}
  .chip-group{display:flex;flex-wrap:wrap;gap:8px;}
  .field{margin-bottom:20px;}
  .field label{display:block;font-size:13px;font-weight:700;color:var(--text-mid);margin-bottom:7px;}
  .field-hint{font-size:11.5px;color:var(--text-soft);margin-top:5px;}
  .form-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(122,174,158,0.2),transparent);margin:24px 0;}
  .form-card{background:rgba(255,255,255,0.85);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.95);border-radius:26px;padding:32px 28px;box-shadow:0 8px 36px rgba(0,0,0,0.07);}
  .submit-row{display:flex;gap:10px;align-items:center;justify-content:flex-end;margin-top:8px;flex-wrap:wrap;}
  .kids-counter{display:flex;align-items:center;width:fit-content;background:rgba(212,236,230,0.3);border:1.5px solid rgba(122,174,158,0.25);border-radius:50px;overflow:hidden;}
  .counter-btn{width:38px;height:38px;border:none;background:transparent;font-size:18px;font-weight:700;color:var(--sage);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;}
  .counter-btn:hover{background:rgba(122,174,158,0.15);}
  .counter-val{min-width:42px;text-align:center;font-size:16px;font-weight:700;color:var(--text-dark);}
  .kids-ages{display:flex;flex-wrap:wrap;gap:9px;margin-top:12px;}
  .age-chip{display:flex;align-items:center;gap:6px;background:white;border:1.5px solid rgba(122,174,158,0.25);border-radius:50px;padding:4px 8px 4px 14px;animation:popIn 0.3s ease both;}
  .age-chip label{font-size:12px;font-weight:700;color:var(--text-mid);white-space:nowrap;}
  .age-chip input{width:46px;border:none;background:rgba(212,236,230,0.35);border-radius:50px;padding:5px 8px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:600;color:var(--text-dark);text-align:center;outline:none;}
  .stepper-wrap{max-width:520px;margin:28px auto 0;padding:0 24px;}
  .stepper{display:flex;align-items:center;}
  .step{display:flex;flex-direction:column;align-items:center;flex:1;position:relative;}
  .step:not(:last-child)::after{content:'';position:absolute;top:15px;left:50%;width:100%;height:2px;background:rgba(122,174,158,0.18);z-index:0;}
  .step.done:not(:last-child)::after{background:var(--sage-light);}
  .step-dot{width:30px;height:30px;border-radius:50%;border:2px solid rgba(122,174,158,0.25);background:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--text-soft);z-index:1;transition:all 0.3s;}
  .step.done .step-dot{background:var(--sage);border-color:var(--sage);color:white;box-shadow:0 3px 10px rgba(122,174,158,0.4);}
  .step.active .step-dot{background:linear-gradient(135deg,var(--sage),var(--sky));border-color:transparent;color:white;box-shadow:0 4px 14px rgba(107,163,190,0.4);transform:scale(1.15);}
  .step-label{font-size:10px;font-weight:700;color:var(--text-soft);margin-top:5px;text-transform:uppercase;letter-spacing:0.06em;text-align:center;}
  .step.active .step-label{color:var(--sage);}
  .step.done .step-label{color:var(--sage-light);}
  .budget-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
  .budget-card{padding:15px 10px;border-radius:15px;border:1.5px solid rgba(122,174,158,0.2);background:white;cursor:pointer;text-align:center;transition:all 0.2s;}
  .budget-card:hover{border-color:var(--sage);transform:translateY(-2px);}
  .budget-card.selected{border-color:var(--sage);background:linear-gradient(135deg,rgba(212,236,230,0.5),rgba(216,235,244,0.5));box-shadow:0 4px 16px rgba(122,174,158,0.2);}
  .budget-icon{font-size:22px;margin-bottom:5px;}
  .budget-label{font-size:14px;font-weight:700;color:var(--text-dark);}
  .budget-desc{font-size:11px;color:var(--text-soft);margin-top:3px;line-height:1.4;}
  .family-summary{background:linear-gradient(135deg,rgba(212,236,230,0.35),rgba(216,235,244,0.35));border-radius:16px;padding:18px 20px;}
  .summary-row{display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid rgba(122,174,158,0.1);}
  .summary-row:last-child{border-bottom:none;}
  .summary-icon{font-size:15px;width:22px;text-align:center;flex-shrink:0;}
  .summary-text{font-size:13px;color:var(--text-mid);}
  .summary-text strong{color:var(--text-dark);}

  /* PLANNER */
  .planner-page{max-width:1060px;margin:0 auto;padding:28px 20px 60px;}
  .planner-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:24px;flex-wrap:wrap;}
  .planner-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--text-dark);margin-bottom:4px;}
  .planner-sub{font-size:13.5px;color:var(--text-soft);}
  .planner-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
  .day-tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:3px;margin-bottom:20px;scrollbar-width:none;}
  .day-tabs::-webkit-scrollbar{display:none;}
  .day-tab{flex-shrink:0;padding:9px 18px;border-radius:50px;border:1.5px solid rgba(122,174,158,0.22);background:rgba(255,255,255,0.7);font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;color:var(--text-soft);cursor:pointer;transition:all 0.2s;white-space:nowrap;}
  .day-tab:hover{border-color:var(--sage);color:var(--sage);}
  .day-tab.active{background:linear-gradient(135deg,var(--sage),var(--sky));color:white;border-color:transparent;box-shadow:0 4px 14px rgba(122,174,158,0.35);}
  .meal-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
  @media(min-width:700px){.meal-grid{grid-template-columns:repeat(4,1fr);}}
  .meal-card{background:rgba(255,255,255,0.85);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.95);border-radius:20px;padding:18px 16px;box-shadow:0 4px 18px rgba(0,0,0,0.06);transition:all 0.25s;animation:fadeUp 0.4s ease both;position:relative;overflow:hidden;}
  .meal-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,0.09);}
  .meal-type-badge{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;padding:3px 10px;border-radius:50px;margin-bottom:11px;}
  .meal-emoji{font-size:28px;margin-bottom:8px;display:block;}
  .meal-name{font-family:'Playfair Display',serif;font-size:15px;font-weight:600;color:var(--text-dark);line-height:1.35;margin-bottom:6px;}
  .meal-desc{font-size:11.5px;color:var(--text-soft);line-height:1.55;}
  .meal-regen{position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:50%;background:rgba(212,236,230,0.6);border:none;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;color:var(--sage);}
  .meal-card:hover .meal-regen{opacity:1;}
  .meal-regen:hover{background:rgba(122,174,158,0.25);}
  .type-breakfast{background:rgba(250,217,196,0.4);color:#C4774A;}
  .type-lunch{background:rgba(212,236,230,0.5);color:#4A8A7A;}
  .type-dinner{background:rgba(216,235,244,0.5);color:#3A7A9E;}
  .type-snack{background:rgba(232,224,240,0.5);color:#7A6A9E;}
  .skeleton{background:linear-gradient(90deg,rgba(212,236,230,0.4) 25%,rgba(212,236,230,0.7) 50%,rgba(212,236,230,0.4) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px;}
  .skel-line{height:12px;margin-bottom:8px;border-radius:6px;}
  .skel-title{height:16px;width:75%;margin-bottom:10px;border-radius:6px;}

  /* GENERATING OVERLAY */
  .generating-overlay{position:fixed;inset:0;z-index:200;background:rgba(247,250,249,0.92);backdrop-filter:blur(12px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;animation:fadeUp 0.4s ease both;}
  .generating-icon{font-size:56px;animation:pulse 1.5s ease infinite;}
  .generating-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--text-dark);}
  .generating-sub{font-size:15px;color:var(--text-soft);max-width:340px;text-align:center;line-height:1.6;}
  .spinner{width:36px;height:36px;border:3px solid rgba(122,174,158,0.2);border-top-color:var(--sage);border-radius:50%;animation:spin 0.8s linear infinite;}
  .generating-steps{display:flex;flex-direction:column;gap:8px;margin-top:8px;}
  .gen-step{font-size:13px;color:var(--text-soft);display:flex;align-items:center;gap:8px;transition:color 0.3s;}
  .gen-step.done{color:var(--sage);font-weight:600;}
  .gen-step.active{color:var(--text-dark);font-weight:700;}

  /* SHOPPING */
  .shopping-page{max-width:760px;margin:0 auto;padding:28px 20px 80px;}
  .shopping-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:28px;flex-wrap:wrap;}
  .shopping-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--text-dark);margin-bottom:4px;}
  .shopping-sub{font-size:13.5px;color:var(--text-soft);}
  .shopping-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
  .progress-bar-wrap{background:rgba(212,236,230,0.35);border-radius:50px;height:8px;margin-bottom:6px;overflow:hidden;}
  .progress-bar-fill{height:100%;border-radius:50px;background:linear-gradient(90deg,var(--sage),var(--sky));transition:width 0.5s ease;}
  .progress-label{font-size:12px;color:var(--text-soft);margin-bottom:22px;}
  .progress-label strong{color:var(--sage);}
  .category-section{margin-bottom:18px;animation:fadeUp 0.4s ease both;}
  .category-header{display:flex;align-items:center;gap:10px;padding:14px 18px;background:rgba(255,255,255,0.75);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.95);border-radius:16px 16px 0 0;border-bottom:1px solid rgba(122,174,158,0.12);cursor:pointer;user-select:none;transition:background 0.2s;}
  .category-header:hover{background:rgba(255,255,255,0.9);}
  .category-header.collapsed{border-radius:16px;}
  .category-emoji{font-size:20px;}
  .category-name{font-family:'Playfair Display',serif;font-size:16px;font-weight:600;color:var(--text-dark);flex:1;}
  .category-count{font-size:12px;font-weight:700;color:var(--text-soft);background:rgba(212,236,230,0.4);padding:2px 10px;border-radius:50px;}
  .category-chevron{font-size:12px;color:var(--text-soft);transition:transform 0.2s;}
  .category-chevron.open{transform:rotate(180deg);}
  .category-items{background:rgba(255,255,255,0.65);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.95);border-top:none;border-radius:0 0 16px 16px;overflow:hidden;}
  .shop-item{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid rgba(122,174,158,0.08);transition:background 0.15s;cursor:pointer;}
  .shop-item:last-child{border-bottom:none;}
  .shop-item:hover{background:rgba(212,236,230,0.2);}
  .shop-item.checked{background:rgba(212,236,230,0.12);}
  .shop-checkbox{width:22px;height:22px;border-radius:7px;border:2px solid rgba(122,174,158,0.4);background:white;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
  .shop-item.checked .shop-checkbox{background:linear-gradient(135deg,var(--sage),var(--sky));border-color:transparent;box-shadow:0 2px 8px rgba(122,174,158,0.35);}
  .shop-checkbox-tick{color:white;font-size:12px;font-weight:700;animation:checkPop 0.25s ease both;}
  .shop-item-text{font-size:14px;font-weight:500;color:var(--text-dark);flex:1;transition:color 0.2s;position:relative;}
  .shop-item.checked .shop-item-text{color:var(--text-soft);}
  .shop-item.checked .shop-item-text::after{content:'';position:absolute;left:0;top:50%;height:1.5px;background:var(--text-soft);animation:strikeThrough 0.25s ease forwards;}
  .add-item-row{display:flex;gap:8px;padding:10px 14px;border-top:1px solid rgba(122,174,158,0.1);}
  .add-item-input{flex:1;border:1.5px solid rgba(122,174,158,0.22);border-radius:10px;padding:8px 12px;font-family:'Nunito',sans-serif;font-size:13px;color:var(--text-dark);background:white;outline:none;}
  .add-item-input:focus{border-color:var(--sage);}
  .add-item-btn{padding:8px 14px;background:linear-gradient(135deg,var(--sage),var(--sky));color:white;border:none;border-radius:10px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:700;cursor:pointer;}
  .all-done-banner{background:linear-gradient(135deg,rgba(212,236,230,0.5),rgba(216,235,244,0.5));border:1px solid rgba(122,174,158,0.25);border-radius:18px;padding:22px 24px;text-align:center;margin-bottom:24px;animation:popIn 0.4s ease both;}
  .empty-shopping{text-align:center;padding:60px 20px;}
  .empty-shopping div:first-child{font-size:52px;margin-bottom:16px;}
  .empty-shopping h3{font-family:'Playfair Display',serif;font-size:21px;color:var(--text-dark);margin-bottom:8px;}
  .empty-shopping p{color:var(--text-soft);font-size:14px;margin-bottom:22px;}

  /* ── EXPORT MODAL ── */
  .modal-overlay{position:fixed;inset:0;z-index:300;background:rgba(44,62,53,0.35);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeUp 0.25s ease both;}
  .modal{background:white;border-radius:28px;padding:36px 32px;max-width:480px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,0.15);animation:popIn 0.3s ease both;max-height:90vh;overflow-y:auto;}
  .modal-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--text-dark);margin-bottom:6px;}
  .modal-sub{font-size:13.5px;color:var(--text-soft);margin-bottom:26px;line-height:1.5;}
  .export-options{display:flex;flex-direction:column;gap:12px;margin-bottom:26px;}
  .export-option{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1.5px solid rgba(122,174,158,0.22);background:white;cursor:pointer;transition:all 0.2s;text-align:left;}
  .export-option:hover{border-color:var(--sage);background:rgba(212,236,230,0.12);transform:translateY(-1px);}
  .export-option.selected{border-color:var(--sage);background:linear-gradient(135deg,rgba(212,236,230,0.3),rgba(216,235,244,0.3));box-shadow:0 4px 14px rgba(122,174,158,0.18);}
  .export-option-icon{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
  .export-option-text{}
  .export-option-label{font-size:14px;font-weight:700;color:var(--text-dark);margin-bottom:2px;}
  .export-option-desc{font-size:12px;color:var(--text-soft);}
  .modal-footer{display:flex;gap:10px;justify-content:flex-end;}

  /* HERO */
  .hero{padding:52px 24px 36px;text-align:center;max-width:660px;margin:0 auto;animation:fadeUp 0.6s ease both;}
  .hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(178,216,204,0.4);border:1px solid rgba(122,174,158,0.3);border-radius:50px;padding:4px 14px;font-size:12px;font-weight:700;color:var(--sage);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:18px;}
  .hero h1{font-family:'Playfair Display',serif;font-size:clamp(28px,5vw,46px);font-weight:700;line-height:1.2;color:var(--text-dark);margin-bottom:13px;}
  .hero h1 em{font-style:normal;background:linear-gradient(135deg,var(--sage),var(--sky));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .hero p{font-size:16px;line-height:1.7;color:var(--text-mid);max-width:480px;margin:0 auto;}
  .footer{text-align:center;padding:24px;font-size:12px;color:var(--text-soft);border-top:1px solid rgba(122,174,158,0.12);}
  .footer span{color:var(--sage);font-weight:700;}

  @media(max-width:600px){
    .nav-tabs{display:none;}
    .planner-header,.shopping-header{flex-direction:column;}
    .meal-grid{grid-template-columns:1fr 1fr;}
    .form-card{padding:22px 16px;}
    .modal{padding:26px 20px;}
  }

  /* ── PRINT STYLES ── */
  @media print {
    body * { visibility: hidden; }
    #print-area, #print-area * { visibility: visible; }
    #print-area {
      position: fixed;
      inset: 0;
      background: white;
      z-index: 9999;
      overflow: auto;
    }
    @page { margin: 0.6in; size: letter; }
  }
`;

// ── PRINT DOCUMENT BUILDER ──
function buildPrintHTML({ weekPlan, shoppingList, familyName, exportType }) {
  const DAYS_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];
  const MEAL_COLORS_PRINT = {
    Breakfast:"#FDE8D4", Lunch:"#D4ECE6", Dinner:"#D8EBF4", Snack:"#E8E0F0"
  };
  const MEAL_TEXT_COLORS = {
    Breakfast:"#A0622A", Lunch:"#3A7A6A", Dinner:"#2A6A8E", Snack:"#5A508E"
  };

  const title = familyName ? `The ${familyName} Family's Weekly Planner` : "My Family's Weekly Planner";
  const dateStr = new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });

  const mealPlanHTML = exportType !== "shopping" && weekPlan ? `
    <div class="section-title">🗓 Weekly Meal Plan</div>
    ${DAYS_FULL.map(day => {
      const dayData = weekPlan.days?.find(d => d.day === day);
      if (!dayData) return "";
      return `
        <div class="day-block">
          <div class="day-header">${day}</div>
          <div class="meals-row">
            ${MEAL_TYPES.map(type => {
              const meal = dayData.meals?.[type];
              return `
                <div class="meal-box" style="border-top: 3px solid ${MEAL_COLORS_PRINT[type]}">
                  <div class="meal-type" style="color:${MEAL_TEXT_COLORS[type]};background:${MEAL_COLORS_PRINT[type]}">${type}</div>
                  <div class="meal-name-print">${meal?.emoji || ""} ${meal?.name || "—"}</div>
                  <div class="meal-desc-print">${meal?.desc || ""}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }).join("")}
  ` : "";

  const shoppingHTML = exportType !== "meals" && shoppingList ? `
    <div class="section-title" style="margin-top:${exportType==="both"?"40px":"0"}">🛒 Shopping List</div>
    <div class="shopping-grid">
      ${shoppingList.categories.map(cat => `
        <div class="shop-cat">
          <div class="shop-cat-header">${cat.emoji} ${cat.name}</div>
          ${cat.items.map(item => `
            <div class="shop-item-print">
              <div class="checkbox-print"></div>
              <span>${item}</span>
            </div>
          `).join("")}
        </div>
      `).join("")}
    </div>
  ` : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet"/>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Nunito',sans-serif; color:#2C3E35; background:white; padding:0; }

        .print-page { max-width:100%; padding:0; }

        /* HEADER */
        .print-header {
          background: linear-gradient(135deg, #7AAE9E, #6BA3BE);
          color: white;
          padding: 28px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .print-header-logo { display:flex; align-items:center; gap:12px; }
        .print-logo-icon { width:44px; height:44px; background:rgba(255,255,255,0.25); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; }
        .print-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; }
        .print-subtitle { font-size:11px; opacity:0.85; margin-top:2px; letter-spacing:0.05em; text-transform:uppercase; }
        .print-date { font-size:12px; opacity:0.8; text-align:right; }

        .print-body { padding: 0 36px 36px; }

        .section-title {
          font-family:'Playfair Display',serif;
          font-size:18px;
          font-weight:700;
          color:#2C3E35;
          margin-bottom:16px;
          padding-bottom:8px;
          border-bottom:2px solid #D4ECE6;
        }

        /* MEAL PLAN */
        .day-block { margin-bottom:20px; break-inside:avoid; }
        .day-header {
          font-family:'Playfair Display',serif;
          font-size:14px;
          font-weight:700;
          color:#7AAE9E;
          text-transform:uppercase;
          letter-spacing:0.08em;
          margin-bottom:8px;
          padding:6px 12px;
          background:#F0F9F6;
          border-radius:8px;
          display:inline-block;
        }
        .meals-row { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
        .meal-box {
          border:1px solid #E8F0EE;
          border-radius:10px;
          padding:10px;
          background:white;
        }
        .meal-type {
          font-size:9px;
          font-weight:700;
          letter-spacing:0.08em;
          text-transform:uppercase;
          padding:2px 8px;
          border-radius:50px;
          display:inline-block;
          margin-bottom:6px;
        }
        .meal-name-print {
          font-family:'Playfair Display',serif;
          font-size:12px;
          font-weight:600;
          color:#2C3E35;
          margin-bottom:4px;
          line-height:1.3;
        }
        .meal-desc-print { font-size:10px; color:#7A9B8A; line-height:1.4; }

        /* SHOPPING */
        .shopping-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .shop-cat {
          border:1px solid #E8F0EE;
          border-radius:12px;
          overflow:hidden;
          break-inside:avoid;
        }
        .shop-cat-header {
          background: linear-gradient(135deg, #D4ECE6, #D8EBF4);
          padding: 9px 14px;
          font-family:'Playfair Display',serif;
          font-size:13px;
          font-weight:700;
          color:#2C3E35;
          border-bottom:1px solid #E8F0EE;
        }
        .shop-item-print {
          display:flex;
          align-items:center;
          gap:8px;
          padding:7px 14px;
          border-bottom:1px solid rgba(122,174,158,0.1);
          font-size:11.5px;
          color:#4A6358;
        }
        .shop-item-print:last-child { border-bottom:none; }
        .checkbox-print {
          width:14px; height:14px;
          border:1.5px solid #A8CFC3;
          border-radius:4px;
          flex-shrink:0;
        }

        /* FOOTER */
        .print-footer {
          margin-top:32px;
          padding:16px 36px;
          border-top:1px solid #E8F0EE;
          display:flex;
          justify-content:space-between;
          align-items:center;
          font-size:10px;
          color:#7A9B8A;
        }
        .print-footer-brand { font-weight:700; color:#7AAE9E; }

        @media print {
          body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          .day-block { break-inside:avoid; }
          .shop-cat { break-inside:avoid; }
        }
      </style>
    </head>
    <body>
      <div class="print-page">
        <div class="print-header">
          <div class="print-header-logo">
            <div class="print-logo-icon">🌿</div>
            <div>
              <div class="print-title">${title}</div>
              <div class="print-subtitle">Busy Family Plans · Weekly Planner</div>
            </div>
          </div>
          <div class="print-date">Generated on<br/>${dateStr}</div>
        </div>
        <div class="print-body">
          ${mealPlanHTML}
          ${shoppingHTML}
        </div>
        <div class="print-footer">
          <div>Made with 💚 by <span class="print-footer-brand">Busy Family Plans</span></div>
          <div>@EmilyAc62161093 · busyfamilyplans.com</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ─────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];
const DIET_OPTIONS = ["No restrictions","Vegetarian","Vegan","Gluten-free","Dairy-free","Nut-free","Halal","Kosher","Low-carb / Keto","Paleo"];
const EATING_STYLES = ["Classic American 🍔","Mediterranean 🫒","Asian-inspired 🍜","Mexican / Tex-Mex 🌮","Comfort food 🍲","Quick & easy ⚡","Batch cooking 🥘","Kid-friendly first 🧒"];
const BUDGET_OPTIONS = [
  {id:"low",icon:"💚",label:"Low",desc:"Keep it affordable"},
  {id:"medium",icon:"💛",label:"Medium",desc:"A little more variety"},
  {id:"flexible",icon:"🌟",label:"Flexible",desc:"No budget limit"},
];
const STEPS = ["Family Info","Diet & Style","Review"];
const MEAL_COLORS = {Breakfast:"type-breakfast",Lunch:"type-lunch",Dinner:"type-dinner",Snack:"type-snack"};
const MEAL_ICONS_DEFAULT = {Breakfast:"🌅",Lunch:"☀️",Dinner:"🌙",Snack:"🍎"};

// ─────────────────────────────────────────
//  AI FUNCTIONS
// ─────────────────────────────────────────
async function generateWeekPlan(family) {
  const { adults, numKids, kidAges, diets, eatStyle, budget, allergies } = family;
  const agesStr = kidAges.filter(Boolean).length ? `ages ${kidAges.filter(Boolean).join(", ")}` : "ages not specified";
  const prompt = `You are a friendly family meal planner. Generate a full 7-day family meal plan.
Family: ${adults} adult(s), ${numKids} kid(s) (${agesStr}). Diet: ${diets.length?diets.join(", "):"none"}. Style: ${eatStyle.length?eatStyle.join(", "):"any"}. Budget: ${budget}. Avoid: ${allergies||"none"}.
Return ONLY valid JSON (no markdown):
{"days":[{"day":"Monday","meals":{"Breakfast":{"name":"...","emoji":"...","desc":"..."},"Lunch":{"name":"...","emoji":"...","desc":"..."},"Dinner":{"name":"...","emoji":"...","desc":"..."},"Snack":{"name":"...","emoji":"...","desc":"..."}}}]}
All 7 days required. Respect all restrictions. Kid snacks fun and simple.`;
  const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":"YOUR_API_KEY_HERE","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:[{role:"user",content:prompt}]})});
  const data = await res.json();
  return JSON.parse(data.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim());
}

async function generateShoppingList(weekPlan) {
  const allMeals = weekPlan.days.flatMap(d=>Object.values(d.meals).map(m=>m.name)).join(", ");
  const prompt = `Family meals this week: ${allMeals}. Generate a practical grouped shopping list with quantities.
Return ONLY valid JSON:{"categories":[{"name":"Produce","emoji":"🥦","items":["2 lbs broccoli"]},{"name":"Proteins","emoji":"🥩","items":[]},{"name":"Dairy & Eggs","emoji":"🧀","items":[]},{"name":"Pantry & Grains","emoji":"🫙","items":[]},{"name":"Breads & Bakery","emoji":"🍞","items":[]},{"name":"Snacks & Extras","emoji":"🍎","items":[]}]}
Include realistic quantities, combine duplicates, omit staples like salt/pepper/oil. Only include categories with items.`;
  const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":"YOUR_API_KEY_HERE","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:prompt}]})});
  const data = await res.json();
  return JSON.parse(data.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim());
}

async function regenerateMeal(family, day, mealType) {
  const { adults, numKids, kidAges, diets, eatStyle, budget, allergies } = family;
  const agesStr = kidAges.filter(Boolean).length?`ages ${kidAges.filter(Boolean).join(", ")}`:"unspecified ages";
  const prompt = `ONE ${mealType} meal. Family: ${adults} adults, ${numKids} kids (${agesStr}). Diet: ${diets.join(", ")||"none"}. Budget: ${budget}. Avoid: ${allergies||"none"}.
Return ONLY: {"name":"...","emoji":"...","desc":"..."}`;
  const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":"YOUR_API_KEY_HERE","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:200,messages:[{role:"user",content:prompt}]})});
  const data = await res.json();
  return JSON.parse(data.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim());
}

// ─────────────────────────────────────────
//  COMPONENTS
// ─────────────────────────────────────────
function MealCard({ type, meal, onRegen, isLoading }) {
  return (
    <div className={`meal-card${isLoading?" loading":""}`}>
      <div className={`meal-type-badge ${MEAL_COLORS[type]}`}>{MEAL_ICONS_DEFAULT[type]} {type}</div>
      {isLoading ? (
        <>
          <div className="skeleton" style={{width:40,height:36,borderRadius:8,marginBottom:10}}/>
          <div className="skeleton skel-title"/>
          <div className="skeleton skel-line" style={{width:"90%"}}/>
          <div className="skeleton skel-line" style={{width:"70%"}}/>
        </>
      ) : (
        <>
          <span className="meal-emoji">{meal?.emoji||MEAL_ICONS_DEFAULT[type]}</span>
          <div className="meal-name">{meal?.name||"—"}</div>
          <div className="meal-desc">{meal?.desc||""}</div>
          <button className="meal-regen" onClick={onRegen} title="Try a different suggestion">🔄</button>
        </>
      )}
    </div>
  );
}

function GeneratingOverlay({ genStep, mode }) {
  const mealSteps = ["Reading your family's preferences…","Planning meals for all 7 days…","Adding snacks & finishing touches…","Almost done…"];
  const shopSteps = ["Looking at your week's meals…","Finding all the ingredients…","Grouping by category…","Building your list…"];
  const steps = mode==="shopping"?shopSteps:mealSteps;
  return (
    <div className="generating-overlay">
      <div className="generating-icon">{mode==="shopping"?"🛒":"🌿"}</div>
      <div className="generating-title">{mode==="shopping"?"Building your shopping list…":"Building your week…"}</div>
      <div className="generating-sub">{mode==="shopping"?"Pulling every ingredient from your 7-day plan!":"Personalizing 7 days of meals just for your family!"}</div>
      <div className="spinner"/>
      <div className="generating-steps">
        {steps.map((s,i)=>(
          <div key={s} className={`gen-step${i<genStep?" done":i===genStep?" active":""}`}>
            {i<genStep?"✓":i===genStep?"→":"○"} {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShoppingCategory({ category, index, checked, onToggle }) {
  const [collapsed, setCollapsed] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [extraItems, setExtraItems] = useState([]);
  const allItems = [...category.items, ...extraItems];
  const checkedCount = allItems.filter(item=>checked[`${index}_${item}`]).length;
  const addItem = () => { if(!newItem.trim())return; setExtraItems(p=>[...p,newItem.trim()]); setNewItem(""); };
  return (
    <div className="category-section" style={{animationDelay:`${index*0.06}s`}}>
      <div className={`category-header${collapsed?" collapsed":""}`} onClick={()=>setCollapsed(v=>!v)}>
        <span className="category-emoji">{category.emoji}</span>
        <span className="category-name">{category.name}</span>
        <span className="category-count">{checkedCount}/{allItems.length}</span>
        <span className={`category-chevron${collapsed?"":" open"}`}>▼</span>
      </div>
      {!collapsed && (
        <div className="category-items">
          {allItems.map(item=>{
            const key=`${index}_${item}`;
            return (
              <div key={key} className={`shop-item${checked[key]?" checked":""}`} onClick={()=>onToggle(key)}>
                <div className="shop-checkbox">{checked[key]&&<span className="shop-checkbox-tick">✓</span>}</div>
                <span className="shop-item-text">{item}</span>
              </div>
            );
          })}
          <div className="add-item-row">
            <input className="add-item-input" placeholder="+ Add an item…" value={newItem}
              onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()}/>
            <button className="add-item-btn" onClick={addItem}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── EXPORT MODAL ──
function ExportModal({ onClose, onExport, hasShoppingList }) {
  const [selected, setSelected] = useState(hasShoppingList ? "both" : "meals");
  const [isExporting, setIsExporting] = useState(false);

  const options = [
    { id:"both", icon:"📋", color:"#D4ECE6", label:"Full Weekly Package", desc:"Meal plan + shopping list together — perfect for sticking on the fridge!" },
    { id:"meals", icon:"🗓", color:"#D8EBF4", label:"Meal Plan Only", desc:"Just the 7-day meal grid with breakfast, lunch, dinner & snacks." },
    ...(hasShoppingList ? [{ id:"shopping", icon:"🛒", color:"#FAD9C4", label:"Shopping List Only", desc:"Just the grouped grocery list with empty checkboxes." }] : []),
  ];

  const handleClick = async () => {
    setIsExporting(true);
    await onExport(selected);
    setIsExporting(false);
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">📄 Download PDF</div>
        <div className="modal-sub">Choose what to include — your PDF will download automatically to your device!</div>
        <div className="export-options">
          {options.map(opt=>(
            <div key={opt.id} className={`export-option${selected===opt.id?" selected":""}`} onClick={()=>setSelected(opt.id)}>
              <div className="export-option-icon" style={{background:opt.color}}>{opt.icon}</div>
              <div className="export-option-text">
                <div className="export-option-label">{opt.label}</div>
                <div className="export-option-desc">{opt.desc}</div>
              </div>
              <div style={{marginLeft:"auto",fontSize:18}}>{selected===opt.id?"✅":"⭕"}</div>
            </div>
          ))}
        </div>
        <div style={{background:"rgba(212,236,230,0.3)",borderRadius:12,padding:"11px 14px",fontSize:12.5,color:"var(--text-mid)",marginBottom:22,lineHeight:1.6}}>
          💡 The PDF will download straight to your <strong>Downloads folder</strong> — then you can open it, print it, or share it with anyone!
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose} disabled={isExporting}>Cancel</button>
          <button className="btn-primary" onClick={handleClick} disabled={isExporting}>
            {isExporting ? <>⏳ Generating…</> : <>⬇️ Download PDF</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [formStep, setFormStep] = useState(0);
  const [activeTab, setActiveTab] = useState("planner");
  const [activeDay, setActiveDay] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  const [familyName, setFamilyName] = useState("");
  const [adults, setAdults] = useState(2);
  const [numKids, setNumKids] = useState(2);
  const [kidAges, setKidAges] = useState(["",""]);
  const [diets, setDiets] = useState([]);
  const [eatStyle, setEatStyle] = useState([]);
  const [budget, setBudget] = useState("medium");
  const [allergies, setAllergies] = useState("");

  const [weekPlan, setWeekPlan] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateMode, setGenerateMode] = useState("meals");
  const [genStep, setGenStep] = useState(0);
  const [regenLoading, setRegenLoading] = useState({});

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h<12?"Good morning":h<17?"Good afternoon":"Good evening");
    try {
      const sp=localStorage.getItem("bfp_weekplan");
      const sl=localStorage.getItem("bfp_shopping");
      const sf=localStorage.getItem("bfp_family");
      const sc=localStorage.getItem("bfp_checked");
      if(sp) setWeekPlan(JSON.parse(sp));
      if(sl) setShoppingList(JSON.parse(sl));
      if(sc) setCheckedItems(JSON.parse(sc));
      if(sf){const f=JSON.parse(sf);setFamilyName(f.familyName||"");setAdults(f.adults||2);setNumKids(f.numKids||2);setKidAges(f.kidAges||[]);setDiets(f.diets||[]);setEatStyle(f.eatStyle||[]);setBudget(f.budget||"medium");setAllergies(f.allergies||"");}
    } catch(e){}
  },[]);

  const family = {familyName,adults,numKids,kidAges,diets,eatStyle,budget,allergies};

  const updateNumKids = (n) => {
    const c=Math.max(0,Math.min(8,n));
    setNumKids(c);
    setKidAges(prev=>{const a=[...prev];while(a.length<c)a.push("");return a.slice(0,c);});
  };

  const toggleChip = (arr,setArr,val) => {
    if(val==="No restrictions"){setArr(["No restrictions"]);return;}
    const f=arr.filter(v=>v!=="No restrictions");
    setArr(f.includes(val)?f.filter(v=>v!==val):[...f,val]);
  };

  const startGenStepper = () => {
    setGenStep(0);
    const t1=setTimeout(()=>setGenStep(1),900);
    const t2=setTimeout(()=>setGenStep(2),2200);
    const t3=setTimeout(()=>setGenStep(3),3800);
    return ()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);setGenerateMode("meals");
    const clear=startGenStepper();
    setScreen("planner");setActiveTab("planner");
    try {
      const result=await generateWeekPlan(family);
      setWeekPlan(result);setShoppingList(null);setCheckedItems({});
      localStorage.setItem("bfp_weekplan",JSON.stringify(result));
      localStorage.setItem("bfp_family",JSON.stringify(family));
      localStorage.removeItem("bfp_shopping");localStorage.removeItem("bfp_checked");
    } catch(e){alert("Something went wrong. Please try again!");}
    clear();setIsGenerating(false);
  };

  const handleGenerateShopping = async () => {
    if(!weekPlan)return;
    setIsGenerating(true);setGenerateMode("shopping");
    const clear=startGenStepper();
    try {
      const result=await generateShoppingList(weekPlan);
      setShoppingList(result);setCheckedItems({});
      localStorage.setItem("bfp_shopping",JSON.stringify(result));
      localStorage.removeItem("bfp_checked");
    } catch(e){alert("Something went wrong. Please try again!");}
    clear();setIsGenerating(false);
    setScreen("shopping");setActiveTab("shopping");
  };

  const handleRegen = async (dayIndex,mealType) => {
    const key=`${dayIndex}_${mealType}`;
    setRegenLoading(prev=>({...prev,[key]:true}));
    try {
      const meal=await regenerateMeal(family,DAYS[dayIndex],mealType);
      setWeekPlan(prev=>{const next=JSON.parse(JSON.stringify(prev));next.days[dayIndex].meals[mealType]=meal;localStorage.setItem("bfp_weekplan",JSON.stringify(next));return next;});
    } catch(e){alert("Couldn't regenerate. Try again!");}
    setRegenLoading(prev=>({...prev,[key]:false}));
  };

  const toggleChecked = (key) => {
    setCheckedItems(prev=>{const next={...prev,[key]:!prev[key]};localStorage.setItem("bfp_checked",JSON.stringify(next));return next;});
  };

  const handleExport = async (exportType) => {
    const html = buildPrintHTML({ weekPlan, shoppingList, familyName, exportType });

    // Create a hidden container and inject the HTML into it
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;left:-9999px;top:0;width:800px;background:white;";
    container.innerHTML = html;
    document.body.appendChild(container);

    // Load html2pdf from CDN if not already loaded
    if (!window.html2pdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const fileName = familyName
      ? `${familyName.replace(/\s+/g,"-")}-Family-Planner.pdf`
      : "Busy-Family-Weekly-Planner.pdf";

    try {
      await window.html2pdf()
        .set({
          margin: [0, 0, 0, 0],
          filename: fileName,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css"] },
        })
        .from(container.querySelector(".print-page") || container)
        .save();
    } catch(e) {
      alert("Something went wrong generating the PDF. Please try again!");
    }

    document.body.removeChild(container);
    setShowExportModal(false);
  };

  const totalItems = shoppingList?.categories?.reduce((s,c)=>s+c.items.length,0)||0;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const allDone = totalItems>0&&checkedCount>=totalItems;
  const dayName = (i)=>{const s=i===1?"st":i===2?"nd":i===3?"rd":"th";return `${i}${s} child`;};
  const summaryLines = [
    {icon:"👨‍👩‍👧‍👦",text:<><strong>{adults} adult{adults!==1?"s":""}</strong> + <strong>{numKids} kid{numKids!==1?"s":""}</strong>{kidAges.filter(Boolean).length?` (ages ${kidAges.filter(Boolean).join(", ")})`:""}</>},
    {icon:"🥗",text:<><strong>Diet:</strong> {diets.length?diets.join(", "):"No restrictions"}</>},
    {icon:"🍽️",text:<><strong>Style:</strong> {eatStyle.length?eatStyle.join(", "):"Not specified"}</>},
    {icon:"💰",text:<><strong>Budget:</strong> {BUDGET_OPTIONS.find(b=>b.id===budget)?.label}</>},
    ...(allergies?[{icon:"⚠️",text:<><strong>Avoid:</strong> {allergies}</>}]:[]),
  ];
  const currentDayData = weekPlan?.days?.[activeDay];

  return (
    <>
      <style>{style}</style>
      <div className="bg-canvas">
        <div className="bg-blob"/><div className="bg-blob"/>
        <div className="bg-blob"/><div className="bg-blob"/>
      </div>

      {isGenerating&&<GeneratingOverlay genStep={genStep} mode={generateMode}/>}
      {showExportModal&&<ExportModal onClose={()=>setShowExportModal(false)} onExport={handleExport} hasShoppingList={!!shoppingList}/>}

      <div className="app-shell">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo" onClick={()=>setScreen("home")}>
            <div className="logo-icon">🌿</div>
            <div><div className="logo-text">Busy Family Plans</div><div className="logo-sub">Weekly Planner</div></div>
          </div>
          <div className="nav-tabs">
            {["planner","shopping"].map(tab=>(
              <button key={tab} className={`nav-tab${activeTab===tab?" active":""}`}
                onClick={()=>{setActiveTab(tab);setScreen(tab==="planner"?(weekPlan?"planner":"home"):"shopping");}}>
                {tab==="planner"?"🗓 Planner":"🛒 Shopping"}
                {tab==="shopping"&&shoppingList&&checkedCount>0&&(
                  <span style={{marginLeft:5,fontSize:10,background:"var(--sage)",color:"white",padding:"1px 6px",borderRadius:50}}>{checkedCount}/{totalItems}</span>
                )}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {weekPlan&&(
              <button className="btn-ghost btn-sm" onClick={()=>setShowExportModal(true)} style={{display:"flex",alignItems:"center",gap:5}}>
                📄 Export PDF
              </button>
            )}
            <button className="nav-cta" onClick={()=>{setScreen("form");setFormStep(0);}}>✨ New Plan</button>
          </div>
        </nav>

        {/* HOME */}
        {screen==="home"&&(
          <>
            <section className="hero">
              <div className="hero-badge">✦ Family Planner ✦</div>
              <h1>{greeting}!<br/>Plan your <em>perfect week</em> together.</h1>
              <p>AI-powered meal plans, a smart shopping list, and a beautiful printable PDF — personalized just for your family.</p>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginTop:26}}>
                <button className="btn-primary" onClick={()=>{setScreen("form");setFormStep(0);}}>🌿 Build My Week Plan →</button>
                {weekPlan&&<button className="btn-ghost" onClick={()=>setScreen("planner")}>📅 View My Last Plan</button>}
              </div>
            </section>
            <div style={{padding:"0 20px 60px",maxWidth:980,margin:"0 auto"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
                {[
                  {icon:"🥗",color:"#D4ECE6",label:"AI Meal Plans",desc:"Personalized 7-day meals based on your family's diet, allergies & budget."},
                  {icon:"🛒",color:"#D8EBF4",label:"Smart Shopping List",desc:"Auto-generated grocery list grouped by category with checkboxes."},
                  {icon:"📄",color:"#E8E0F0",label:"Print & Export PDF",desc:"Beautiful printable plan — stick it on the fridge or save it to your phone."},
                ].map((f,i)=>(
                  <div key={f.label} style={{background:"rgba(255,255,255,0.75)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.9)",borderRadius:20,padding:"22px 18px",boxShadow:"0 4px 18px rgba(0,0,0,0.05)",animation:`fadeUp 0.6s ${0.08+i*0.1}s ease both`}}>
                    <div style={{width:44,height:44,borderRadius:13,background:f.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,marginBottom:11}}>{f.icon}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:"var(--text-dark)",marginBottom:5}}>{f.label}</div>
                    <div style={{fontSize:12.5,color:"var(--text-soft)",lineHeight:1.6}}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* FORM */}
        {screen==="form"&&(
          <>
            <section className="hero" style={{paddingBottom:0}}>
              <div className="hero-badge">✦ Step {formStep+1} of {STEPS.length} ✦</div>
              <h1>Tell us about<br/><em>your family</em></h1>
              <p>We'll personalize everything — takes less than 2 minutes!</p>
            </section>
            <div className="stepper-wrap">
              <div className="stepper">
                {STEPS.map((s,i)=>(
                  <div key={s} className={`step${i<formStep?" done":i===formStep?" active":""}`}>
                    <div className="step-dot">{i<formStep?"✓":i+1}</div>
                    <div className="step-label">{s}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{maxWidth:640,margin:"28px auto 60px",padding:"0 18px"}}>
              <div className="form-card">
                {formStep===0&&(
                  <>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"var(--text-dark)",marginBottom:5}}>Who's in your family? 👨‍👩‍👧‍👦</div>
                    <div style={{fontSize:13,color:"var(--text-soft)",marginBottom:22}}>This helps us size meals and suggest the right portions.</div>
                    <div className="field"><label>What should we call your family? (optional)</label><input className="text-input" placeholder="e.g. The Johnson Family" value={familyName} onChange={e=>setFamilyName(e.target.value)}/></div>
                    <div className="field"><label>Number of adults</label><div className="kids-counter"><button className="counter-btn" onClick={()=>setAdults(Math.max(1,adults-1))}>−</button><div className="counter-val">{adults}</div><button className="counter-btn" onClick={()=>setAdults(Math.min(6,adults+1))}>+</button></div></div>
                    <div className="field">
                      <label>Number of kids</label>
                      <div className="kids-counter"><button className="counter-btn" onClick={()=>updateNumKids(numKids-1)}>−</button><div className="counter-val">{numKids}</div><button className="counter-btn" onClick={()=>updateNumKids(numKids+1)}>+</button></div>
                      {numKids>0&&(<><div className="kids-ages">{kidAges.map((age,i)=>(<div key={i} className="age-chip"><label>{dayName(i+1)}</label><input type="number" min="0" max="17" placeholder="age" value={age} onChange={e=>{const a=[...kidAges];a[i]=e.target.value;setKidAges(a);}}/></div>))}</div><div className="field-hint">💡 Ages help us suggest the right snacks!</div></>)}
                    </div>
                    <div className="submit-row"><button className="btn-ghost" onClick={()=>setScreen("home")}>← Back</button><button className="btn-primary" onClick={()=>setFormStep(1)}>Next: Diet & Style →</button></div>
                  </>
                )}
                {formStep===1&&(
                  <>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"var(--text-dark)",marginBottom:5}}>Diet & eating style 🥗</div>
                    <div style={{fontSize:13,color:"var(--text-soft)",marginBottom:22}}>Pick everything that applies.</div>
                    <div className="field"><label>Dietary needs</label><div className="chip-group">{DIET_OPTIONS.map(d=>(<button key={d} className={`chip${diets.includes(d)?" selected":""}`} onClick={()=>toggleChip(diets,setDiets,d)}>{d}</button>))}</div></div>
                    <div className="form-divider"/>
                    <div className="field"><label>Preferred eating style</label><div className="chip-group">{EATING_STYLES.map(s=>(<button key={s} className={`chip${eatStyle.includes(s)?" selected":""}`} onClick={()=>setEatStyle(prev=>prev.includes(s)?prev.filter(v=>v!==s):[...prev,s])}>{s}</button>))}</div></div>
                    <div className="form-divider"/>
                    <div className="field"><label>Weekly grocery budget</label><div className="budget-cards">{BUDGET_OPTIONS.map(b=>(<div key={b.id} className={`budget-card${budget===b.id?" selected":""}`} onClick={()=>setBudget(b.id)}><div className="budget-icon">{b.icon}</div><div className="budget-label">{b.label}</div><div className="budget-desc">{b.desc}</div></div>))}</div></div>
                    <div className="form-divider"/>
                    <div className="field"><label>Allergies or foods to avoid? (optional)</label><input className="text-input" placeholder="e.g. peanuts, shellfish, no spicy food..." value={allergies} onChange={e=>setAllergies(e.target.value)}/></div>
                    <div className="submit-row"><button className="btn-ghost" onClick={()=>setFormStep(0)}>← Back</button><button className="btn-primary" onClick={()=>setFormStep(2)}>Review →</button></div>
                  </>
                )}
                {formStep===2&&(
                  <>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"var(--text-dark)",marginBottom:5}}>Looks great! 🌿</div>
                    <div style={{fontSize:13,color:"var(--text-soft)",marginBottom:20}}>Everything look right?</div>
                    <div className="family-summary" style={{marginBottom:22}}>{summaryLines.map((s,i)=>(<div key={i} className="summary-row"><div className="summary-icon">{s.icon}</div><div className="summary-text">{s.text}</div></div>))}</div>
                    <div style={{background:"linear-gradient(135deg,rgba(212,236,230,0.3),rgba(216,235,244,0.3))",borderRadius:14,padding:"13px 16px",marginBottom:20,fontSize:13,color:"var(--text-mid)",lineHeight:1.6}}>✨ <strong>Almost there!</strong> Our AI will generate a full 7-day meal plan — all personalized for your family.</div>
                    <div className="submit-row"><button className="btn-ghost" onClick={()=>setFormStep(1)}>← Edit</button><button className="btn-primary" onClick={handleGeneratePlan}>🌿 Generate My Week Plan!</button></div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* PLANNER */}
        {screen==="planner"&&!isGenerating&&(
          <div className="planner-page">
            <div className="planner-header">
              <div>
                <div className="planner-title">{familyName?`The ${familyName} Family's Week`:"Your Family's Week"} 🌿</div>
                <div className="planner-sub">Hover any meal and tap 🔄 to swap it for a new suggestion.</div>
              </div>
              <div className="planner-actions">
                <button className="btn-ghost" onClick={()=>{setScreen("form");setFormStep(0);}}>✏️ Edit Family</button>
                {weekPlan&&<button className="btn-ghost" onClick={handleGenerateShopping}>🛒 Build Shopping List</button>}
                {weekPlan&&<button className="btn-ghost" onClick={()=>setShowExportModal(true)}>📄 Export PDF</button>}
                <button className="btn-primary" onClick={handleGeneratePlan}>🔄 New Week</button>
              </div>
            </div>
            {!weekPlan?(
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <div style={{fontSize:48,marginBottom:16}}>🌿</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"var(--text-dark)",marginBottom:10}}>No plan yet!</div>
                <p style={{color:"var(--text-soft)",marginBottom:22}}>Fill in your family details to get started.</p>
                <button className="btn-primary" onClick={()=>{setScreen("form");setFormStep(0);}}>Build My Plan →</button>
              </div>
            ):(
              <>
                <div className="day-tabs">
                  {DAYS.map((d,i)=>(
                    <button key={d} className={`day-tab${activeDay===i?" active":""}`} onClick={()=>setActiveDay(i)}>{d.slice(0,3)}</button>
                  ))}
                </div>
                <div className="meal-grid">
                  {MEAL_TYPES.map(type=>{
                    const key=`${activeDay}_${type}`;
                    return <MealCard key={type} type={type} meal={currentDayData?.meals?.[type]} isLoading={!!regenLoading[key]} onRegen={()=>handleRegen(activeDay,type)}/>;
                  })}
                </div>
                {!shoppingList?(
                  <div style={{marginTop:22,background:"linear-gradient(135deg,rgba(212,236,230,0.35),rgba(216,235,244,0.35))",borderRadius:18,padding:"18px 22px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                    <div style={{fontSize:28}}>🛒</div>
                    <div style={{flex:1}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:"var(--text-dark)",marginBottom:3}}>Ready to shop?</div><div style={{fontSize:13,color:"var(--text-soft)"}}>We'll pull every ingredient from your whole week and build a grouped list.</div></div>
                    <button className="btn-primary" style={{fontSize:13,padding:"10px 20px"}} onClick={handleGenerateShopping}>Build Shopping List →</button>
                  </div>
                ):(
                  <div style={{marginTop:22,background:"linear-gradient(135deg,rgba(212,236,230,0.35),rgba(216,235,244,0.35))",borderRadius:18,padding:"18px 22px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                    <div style={{fontSize:28}}>✅</div>
                    <div style={{flex:1}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:"var(--text-dark)",marginBottom:3}}>Shopping list is ready!</div><div style={{fontSize:13,color:"var(--text-soft)"}}>{checkedCount} of {totalItems} items checked off.</div></div>
                    <button className="btn-ghost" style={{fontSize:13}} onClick={()=>{setScreen("shopping");setActiveTab("shopping");}}>View List →</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* SHOPPING */}
        {screen==="shopping"&&!isGenerating&&(
          <div className="shopping-page">
            <div className="shopping-header">
              <div>
                <div className="shopping-title">Shopping List 🛒</div>
                <div className="shopping-sub">{familyName?`For the ${familyName} family — `:""}{weekPlan?"Generated from your 7-day meal plan.":"No meal plan yet."}</div>
              </div>
              <div className="shopping-actions">
                {shoppingList&&checkedCount>0&&<button className="btn-ghost btn-sm" onClick={()=>{setCheckedItems({});localStorage.removeItem("bfp_checked");}}>Clear checks</button>}
                {weekPlan&&<button className="btn-ghost btn-sm" onClick={handleGenerateShopping}>🔄 Rebuild</button>}
                {shoppingList&&<button className="btn-ghost btn-sm" onClick={()=>setShowExportModal(true)}>📄 Export PDF</button>}
                <button className="btn-ghost btn-sm" onClick={()=>{setScreen("planner");setActiveTab("planner");}}>← Planner</button>
              </div>
            </div>
            {!shoppingList?(
              <div className="empty-shopping">
                <div>🛒</div>
                <h3>No shopping list yet</h3>
                <p>{weekPlan?"Your meal plan is ready — click below to build your grocery list!":"Start by building your meal plan first."}</p>
                {weekPlan?<button className="btn-primary" onClick={handleGenerateShopping}>Build Shopping List →</button>:<button className="btn-primary" onClick={()=>{setScreen("form");setFormStep(0);}}>Build My Meal Plan →</button>}
              </div>
            ):(
              <>
                {totalItems>0&&(
                  <div style={{marginBottom:24}}>
                    <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${(checkedCount/totalItems)*100}%`}}/></div>
                    <div className="progress-label">{allDone?<strong style={{color:"var(--sage)"}}>🎉 All done! Happy shopping!</strong>:<><strong>{checkedCount}</strong> of <strong>{totalItems}</strong> items checked off</>}</div>
                  </div>
                )}
                {allDone&&(
                  <div className="all-done-banner">
                    <div style={{fontSize:36,marginBottom:8}}>🎉</div>
                    <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:19,color:"var(--text-dark)",marginBottom:4}}>You've got everything!</h3>
                    <p style={{fontSize:13,color:"var(--text-soft)"}}>Your cart is fully loaded for the week. Enjoy the meals!</p>
                  </div>
                )}
                {shoppingList.categories.map((cat,i)=>(
                  <ShoppingCategory key={cat.name} category={cat} index={i} checked={checkedItems} onToggle={toggleChecked}/>
                ))}
              </>
            )}
          </div>
        )}

        <footer className="footer">
          Made with 💚 by <span>Busy Family Plans</span> · @EmilyAc62161093
        </footer>
      </div>
    </>
  );
}
