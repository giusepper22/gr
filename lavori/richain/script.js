(function() {
    // 1. Simulazione Dati TVL e Bonus in tempo reale (Header)
    let tvl = 1247832, bonus = 12478;
    const fmt = v => v >= 1e6 ? '$' + (v / 1e6).toFixed(2) + 'M' : v >= 1e3 ? '$' + (v / 1e3).toFixed(1) + 'K' : '$' + v;
    
    setInterval(() => {
        tvl += (Math.random() - 0.48) * 3800;
        tvl = Math.max(950000, Math.min(1800000, tvl));
        bonus = tvl * 0.01;
        
        const tvlEl = document.getElementById('tvl');
        const bonusEl = document.getElementById('bonus');
        if (tvlEl) tvlEl.textContent = fmt(tvl);
        if (bonusEl) bonusEl.textContent = fmt(bonus);
    }, 1500);

    // 2. Logica del Simulatore di Rendimento (Calcolatrice)
    const depInput = document.getElementById('depInput');
    const dcaInput = document.getElementById('dcaInput');
    const sDep = document.getElementById('sDep'), sDeFi = document.getElementById('sDeFi'),
          sBase = document.getElementById('sBase'), sBonus = document.getElementById('sBonus'),
          sTotal = document.getElementById('sTotal'), netGain = document.getElementById('netGain'),
          totalReturn = document.getElementById('totalReturn'), effectiveApy = document.getElementById('effectiveApy');
          
    const fmtNum = n => '$' + Number(n).toLocaleString('it-IT', { maximumFractionDigits: 0 });

    function updateSim() {
        if (!depInput || !dcaInput) return;

        let raw = depInput.value.replace(/[^\d]/g, '');
        let v = raw === '' ? 0 : parseInt(raw, 10);
        if (isNaN(v)) v = 0;
        v = Math.max(0, Math.min(100000000, v));
        depInput.value = v;
        
        let rawDca = dcaInput.value.replace(/[^\d]/g, '');
        let monthly = rawDca === '' ? 0 : parseInt(rawDca, 10);
        if (isNaN(monthly)) monthly = 0;
        monthly = Math.max(0, Math.min(10000000, monthly));
        dcaInput.value = monthly;
        
        if (v === 0 && monthly === 0) {
            sDep.textContent = '$0'; sDeFi.textContent = '$0'; sBase.textContent = '$0';
            sBonus.textContent = '$0'; sTotal.textContent = '$0';
            netGain.textContent = '$0'; totalReturn.textContent = '$0'; effectiveApy.textContent = '0,00%';
            return;
        }
        
        const monthlyRate = 0.04 / 12;
        const baseMonthlyRate = 0.03 / 12;
        let futureValue = v;
        let totalDeFiYield = 0;
        let totalBaseYield = 0;
        
        for (let m = 0; m < 12; m++) {
            const defiYieldMonth = futureValue * monthlyRate;
            const baseYieldMonth = futureValue * baseMonthlyRate;
            totalDeFiYield += defiYieldMonth;
            totalBaseYield += baseYieldMonth;
            futureValue += defiYieldMonth + baseYieldMonth + monthly;
        }
        
        const totalFee = (totalDeFiYield + totalBaseYield) * 0.01;
        const bonusEst = Math.round(futureValue * 0.0042);
        const finalTotal = futureValue + bonusEst - totalFee;
        const gain = finalTotal - v - (monthly * 12);
        const totalInvested = v + (monthly * 12);
        const apyPercent = totalInvested > 0 ? ((gain / totalInvested) * 100).toFixed(2).replace('.', ',') : '0,00';
        
        sDep.textContent = fmtNum(v);
        sDeFi.textContent = fmtNum(totalDeFiYield);
        sBase.textContent = fmtNum(totalBaseYield);
        sBonus.textContent = fmtNum(bonusEst);
        sTotal.textContent = fmtNum(finalTotal);
        netGain.textContent = fmtNum(gain);
        totalReturn.textContent = fmtNum(finalTotal);
        effectiveApy.textContent = apyPercent + '%';
    }

    if (depInput && dcaInput) {
        depInput.addEventListener('input', updateSim);
        dcaInput.addEventListener('input', updateSim);
        depInput.addEventListener('blur', function() { if (this.value === '') this.value = 0; updateSim(); });
        dcaInput.addEventListener('blur', function() { if (this.value === '') this.value = 0; updateSim(); });
        updateSim(); // Esegue il calcolo all'avvio
    }

    // 3. Animazioni al momento dello scroll (Reveal)
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { 
            if (e.isIntersecting) { 
                e.target.classList.add('visible'); 
                obs.unobserve(e.target); 
            } 
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => obs.observe(el));

    // 4. Comportamento Navbar (effetto scrolled e menu mobile)
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
        document.querySelectorAll('#navLinks a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // 5. Smooth Scroll per i link interni
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const t = document.querySelector(this.getAttribute('href'));
            if (t) { 
                e.preventDefault(); 
                t.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }
        });
    });

    // 6. Forza un resize per far caricare bene i widget di TradingView
    window.addEventListener('load', () => {
        setTimeout(() => window.dispatchEvent(new Event('resize')), 1200);
    });
})();