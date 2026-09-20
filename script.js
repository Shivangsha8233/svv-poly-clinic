/**
 * SVV Poly Clinic & Diagnostics — Interactive Logic
 * Location: Madhapur, Hyderabad
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Preloader fade out
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 600);
    }

    // Sticky Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Slide-in Drawer Controls (Phone screens only)
    const mobileToggle = document.getElementById('mobileNavToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');

    function openMobileDrawer() {
        if (mobileDrawer && mobileDrawerOverlay) {
            mobileDrawer.style.display = 'flex';
            mobileDrawerOverlay.style.display = 'block';
            setTimeout(() => {
                mobileDrawer.classList.add('active');
                mobileDrawerOverlay.classList.add('active');
            }, 15);
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileDrawer() {
        if (mobileDrawer && mobileDrawerOverlay) {
            mobileDrawer.classList.remove('active');
            mobileDrawerOverlay.classList.remove('active');
            setTimeout(() => {
                mobileDrawer.style.display = '';
                mobileDrawerOverlay.style.display = '';
            }, 320);
            document.body.style.overflow = '';
        }
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', openMobileDrawer);
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    }

    if (mobileDrawerOverlay) {
        mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);
    }

    // Close drawer when any drawer link or action button is clicked
    if (mobileDrawer) {
        mobileDrawer.querySelectorAll('.drawer-link, .drawer-btn').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileDrawer();
            });
        });
    }

    // Smooth KPI Number Counter Animation
    const statsSection = document.querySelector('.hero-stats');
    let animatedStats = false;
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animatedStats) {
                animatedStats = true;
                const statNums = document.querySelectorAll('.stat-num');
                const targets = [18500, 12, 99.8, 15];
                const suffixes = ['+', '+', '%', 'm'];

                statNums.forEach((el, index) => {
                    const target = targets[index];
                    const suffix = suffixes[index];
                    let current = 0;
                    const duration = 1200;
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = target / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        const formatted = target % 1 === 0 ? Math.floor(current).toLocaleString() : current.toFixed(1);
                        el.innerHTML = `${formatted}<span>${suffix}</span>`;
                    }, stepTime);
                });
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // ==========================================
    // DIAGNOSTIC LAB TESTS CATALOG & CART
    // ==========================================
    const diagnosticTests = [
        { id: 't1', name: 'Complete Blood Picture (CBP + ESR)', cat: 'blood', price: 299, original: 550 },
        { id: 't2', name: 'HbA1c (Glycosylated Hemoglobin)', cat: 'diabetes', price: 449, original: 800 },
        { id: 't3', name: 'Fasting Blood Sugar (FBS / PPBS)', cat: 'diabetes', price: 99, original: 200 },
        { id: 't4', name: 'Thyroid Profile Total (T3, T4, TSH)', cat: 'thyroid', price: 399, original: 850 },
        { id: 't5', name: 'Lipid Profile (Cholesterol & Triglycerides)', cat: 'cardiac', price: 499, original: 950 },
        { id: 't6', name: 'Liver Function Test (LFT 11 Parameters)', cat: 'blood', price: 549, original: 1100 },
        { id: 't7', name: 'Kidney Function Test (KFT / RFT)', cat: 'blood', price: 549, original: 1100 },
        { id: 't8', name: 'Vitamin D3 (25-Hydroxy)', cat: 'vitamins', price: 899, original: 1600 },
        { id: 't9', name: 'Vitamin B12 (Cyanocobalamin)', cat: 'vitamins', price: 799, original: 1400 },
        { id: 't10', name: 'Complete Urine Examination (CUE)', cat: 'blood', price: 149, original: 300 },
        { id: 't11', name: 'Serum Calcium & Phosphorus', cat: 'blood', price: 299, original: 600 },
        { id: 't12', name: 'Serum Uric Acid', cat: 'blood', price: 199, original: 400 },
        { id: 't13', name: 'Dengue NS1 Antigen Rapid Test', cat: 'fever', price: 599, original: 900 },
        { id: 't14', name: 'Typhoid Widal / Typhidot Test', cat: 'fever', price: 349, original: 600 },
        { id: 't15', name: 'Serum Electrolytes (Na, K, Cl)', cat: 'blood', price: 449, original: 750 }
    ];

    let cart = [];

    const testsContainer = document.getElementById('testsContainer');
    const testSearchInput = document.getElementById('testSearchInput');
    const cartBanner = document.getElementById('cartBanner');
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    const tabButtons = document.querySelectorAll('.lab-tab-btn');

    function renderTests(filteredList) {
        if (!testsContainer) return;
        testsContainer.innerHTML = '';
        if (filteredList.length === 0) {
            testsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748B;">No tests found matching your search. Please contact our reception for rare lab profiles.</div>';
            return;
        }

        filteredList.forEach(test => {
            const isAdded = cart.some(item => item.id === test.id);
            const card = document.createElement('div');
            card.className = 'test-item-card';
            card.innerHTML = `
                <div class="test-meta">
                    <h5 class="test-name">${test.name}</h5>
                    <div class="test-category">Same-day Digital Report • Serum Lab</div>
                </div>
                <div class="test-price-action">
                    <div>
                        <span class="test-price">₹${test.price}</span>
                        <span style="font-size: 0.8rem; color: #94A3B8; text-decoration: line-through; margin-left: 6px;">₹${test.original}</span>
                    </div>
                    <button class="btn-add-test ${isAdded ? 'added' : ''}" data-id="${test.id}">
                        <i data-lucide="${isAdded ? 'check' : 'plus'}" style="width:14px; height:14px;"></i>
                        ${isAdded ? 'Added' : 'Add Test'}
                    </button>
                </div>
            `;
            testsContainer.appendChild(card);
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Attach add button click handlers
        testsContainer.querySelectorAll('.btn-add-test').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const testObj = diagnosticTests.find(t => t.id === id);
                toggleCartItem(testObj);
            });
        });
    }

    function toggleCartItem(testObj) {
        const index = cart.findIndex(item => item.id === testObj.id);
        if (index > -1) {
            cart.splice(index, 1);
        } else {
            cart.push(testObj);
        }
        updateCartUI();
        renderTests(getCurrentFilteredList());
    }

    function updateCartUI() {
        if (!cartBanner) return;
        if (cart.length > 0) {
            cartBanner.classList.remove('hidden');
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            cartCountEl.textContent = `${cart.length} Test${cart.length > 1 ? 's' : ''}`;
            cartTotalEl.textContent = `₹${total}`;
        } else {
            cartBanner.classList.add('hidden');
        }
    }

    function getCurrentFilteredList() {
        const query = testSearchInput ? testSearchInput.value.toLowerCase().trim() : '';
        const activeTab = document.querySelector('.lab-tab-btn.active');
        const activeCategory = activeTab ? activeTab.getAttribute('data-category') : 'all';

        return diagnosticTests.filter(test => {
            const matchesQuery = test.name.toLowerCase().includes(query);
            const matchesCat = activeCategory === 'all' || test.cat === activeCategory;
            return matchesQuery && matchesCat;
        });
    }

    if (testSearchInput) {
        testSearchInput.addEventListener('input', () => {
            renderTests(getCurrentFilteredList());
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTests(getCurrentFilteredList());
        });
    });

    // Render initial catalog
    renderTests(diagnosticTests);

    // Cart Checkout button -> opens home collection / lab modal
    const checkoutCartBtn = document.getElementById('checkoutCartBtn');
    if (checkoutCartBtn) {
        checkoutCartBtn.addEventListener('click', () => {
            openLabBookingModal(cart);
        });
    }

    // Direct Package Booking buttons
    document.querySelectorAll('.btn-book-pkg').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pkgName = btn.getAttribute('data-pkg-name');
            const pkgPrice = btn.getAttribute('data-pkg-price');
            openLabBookingModal([{ name: pkgName, price: parseInt(pkgPrice, 10) }]);
        });
    });

    // ==========================================
    // INTERACTIVE SYMPTOM CHECKER
    // ==========================================
    const symptomData = {
        'fever': {
            doctor: 'Dr. Vedaswi Rao Velchala (General Physician)',
            dept: 'Internal & General Medicine',
            test: 'Complete Blood Picture (CBP) + Dengue/Malaria Rapid',
            advice: 'Stay hydrated, record temperature every 4 hours, and avoid self-medicating antibiotics.'
        },
        'piles': {
            doctor: 'Dr. Vireesha (Ayurvedic & Anorectal Specialist)',
            dept: 'Ayurvedic Speciality Clinic',
            test: 'Clinical Proctology Examination & Stool Analysis',
            advice: 'Holistic non-surgical management with herbal formulations, dietary fiber, and warm sitz baths.'
        },
        'joint': {
            doctor: 'Dr. Arvind Varma (Orthopedic & Joint Specialist)',
            dept: 'Orthopedics & Joint Care',
            test: 'Serum Uric Acid, Calcium, Vitamin D3 & Bone Screen',
            advice: 'Apply cold/warm compression, maintain gentle posture, and avoid heavy lifting.'
        },
        'child': {
            doctor: 'Dr. R. Pradeep Kumar (Pediatrician & Neonatologist)',
            dept: 'Pediatrics & Neonatal Care',
            test: 'Pediatric Blood Count & Vitals Assessment',
            advice: 'Ensure adequate oral fluid intake, steam inhalation for nasal congestion, and timely vaccines.'
        },
        'women': {
            doctor: 'Dr. K. Srilatha (Consultant Gynecologist)',
            dept: 'Obstetrics & Gynecology',
            test: 'Thyroid Panel, Pelvic Assessment & HbA1c',
            advice: 'Track menstrual cycles, maintain balanced hormonal nutrition, and routine checkups.'
        },
        'diabetes': {
            doctor: 'Dr. Vedaswi Rao Velchala (Diabetologist)',
            dept: 'Diabetic & Metabolic Health',
            test: 'HbA1c + Fasting Blood Sugar + Lipid Profile',
            advice: 'Fasting test required (8-10 hours). Monitor blood glucose log regularly.'
        }
    };

    const chips = document.querySelectorAll('.symptom-chip');
    const recDoctorEl = document.getElementById('recDoctor');
    const recDeptEl = document.getElementById('recDept');
    const recTestEl = document.getElementById('recTest');
    const recAdviceEl = document.getElementById('recAdvice');
    const recBookBtn = document.getElementById('recBookBtn');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const sym = chip.getAttribute('data-symptom');
            const info = symptomData[sym];
            if (info) {
                recDoctorEl.textContent = info.doctor;
                recDeptEl.textContent = info.dept;
                recTestEl.textContent = info.test;
                recAdviceEl.textContent = info.advice;

                recBookBtn.onclick = () => {
                    const wizard = document.getElementById('appointmentSection');
                    if (wizard) {
                        wizard.scrollIntoView({ behavior: 'smooth' });
                        // Pre-select department
                        selectDepartmentByName(info.dept);
                    }
                };
            }
        });
    });

    // ==========================================
    // 4-STEP APPOINTMENT BOOKING WIZARD
    // ==========================================
    let currentStep = 1;
    const totalSteps = 4;
    const wizardForm = document.getElementById('appointmentWizardForm');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const prevStepBtn = document.getElementById('prevStepBtn');

    function updateWizardUI() {
        // Update Step indicators
        for (let i = 1; i <= totalSteps; i++) {
            const stepEl = document.getElementById(`stepIndicator${i}`);
            const paneEl = document.getElementById(`wizardPane${i}`);
            if (stepEl) {
                stepEl.classList.remove('active', 'completed');
                if (i === currentStep) stepEl.classList.add('active');
                if (i < currentStep) stepEl.classList.add('completed');
            }
            if (paneEl) {
                paneEl.classList.toggle('active', i === currentStep);
            }
        }

        // Button states
        if (prevStepBtn) {
            prevStepBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
        }
        if (nextStepBtn) {
            if (currentStep === totalSteps) {
                nextStepBtn.innerHTML = '<i data-lucide="check-circle" style="width:18px;height:18px;"></i> Confirm & Book Slot';
            } else {
                nextStepBtn.innerHTML = 'Next Step <i data-lucide="arrow-right" style="width:18px;height:18px;"></i>';
            }
            if (window.lucide) window.lucide.createIcons();
        }

        if (currentStep === 4) {
            generateSummary();
        }
    }

    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateWizardUI();
                } else {
                    submitAppointment();
                }
            }
        });
    }

    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentStep > 1) {
                currentStep--;
                updateWizardUI();
            }
        });
    }

    // Step 1: Department Cards Selection
    const deptCards = document.querySelectorAll('.dept-radio-card');
    deptCards.forEach(card => {
        card.addEventListener('click', () => {
            deptCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    function selectDepartmentByName(name) {
        deptCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(name.toLowerCase().split(' ')[0])) {
                deptCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const radio = card.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            }
        });
    }

    // Step 3: Time Slot Selection
    const slotButtons = document.querySelectorAll('.time-slot-btn');
    let selectedSlot = '10:30 AM';
    slotButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            slotButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSlot = btn.textContent.trim();
        });
    });

    // Default Date to Tomorrow
    const apptDateInput = document.getElementById('apptDate');
    if (apptDateInput) {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        apptDateInput.value = today.toISOString().split('T')[0];
        apptDateInput.min = new Date().toISOString().split('T')[0];
    }

    function validateStep(step) {
        if (step === 1) {
            const selectedDept = document.querySelector('input[name="dept"]:checked');
            if (!selectedDept) {
                alert('Please select a department to proceed.');
                return false;
            }
            return true;
        } else if (step === 2) {
            const doctor = document.getElementById('apptDoctor').value;
            if (!doctor) {
                alert('Please choose a preferred doctor or option.');
                return false;
            }
            return true;
        } else if (step === 3) {
            const date = document.getElementById('apptDate').value;
            if (!date) {
                alert('Please pick an appointment date.');
                return false;
            }
            return true;
        } else if (step === 4) {
            const name = document.getElementById('patientName').value.trim();
            const phone = document.getElementById('patientPhone').value.trim();
            if (!name) {
                alert('Please enter patient full name.');
                return false;
            }
            if (!phone || phone.length < 10) {
                alert('Please enter a valid 10-digit phone number.');
                return false;
            }
            return true;
        }
        return true;
    }

    function generateSummary() {
        const selectedDept = document.querySelector('input[name="dept"]:checked')?.value || 'General Medicine';
        const docSelect = document.getElementById('apptDoctor');
        const docName = docSelect.options[docSelect.selectedIndex].text;
        const consultType = document.querySelector('input[name="consultType"]:checked')?.value || 'In-Clinic Consultation';
        const date = document.getElementById('apptDate').value;

        const summaryBox = document.getElementById('wizardSummaryBox');
        if (summaryBox) {
            summaryBox.innerHTML = `
                <div style="background: #F1F5F9; border-radius: 12px; padding: 1.25rem; font-size: 0.9rem; line-height: 1.6;">
                    <div style="font-weight: 700; color: #0F172A; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
                        <span>Appointment Summary</span>
                        <span style="color: #0D9488; font-size: 0.8rem; background: #CCFBF1; padding: 2px 8px; border-radius: 999px;">Walk-in Priority Pass</span>
                    </div>
                    <div><strong>Department:</strong> ${selectedDept}</div>
                    <div><strong>Specialist:</strong> ${docName}</div>
                    <div><strong>Type:</strong> ${consultType}</div>
                    <div><strong>Date & Slot:</strong> ${date} at ${selectedSlot}</div>
                    <div><strong>Clinic Venue:</strong> Flat 301, Sri Sai Balaji Complex, Madhapur, Hyderabad</div>
                </div>
            `;
        }
    }

    function submitAppointment() {
        const name = document.getElementById('patientName').value.trim();
        const phone = document.getElementById('patientPhone').value.trim();
        const dept = document.querySelector('input[name="dept"]:checked')?.value || 'General Medicine';
        const docSelect = document.getElementById('apptDoctor');
        const docName = docSelect.options[docSelect.selectedIndex].text;
        const date = document.getElementById('apptDate').value;
        const token = 'SVV-' + Math.floor(100000 + Math.random() * 900000);

        // Show Confirmation Modal
        showConfirmationModal({
            token,
            name,
            phone,
            dept,
            doctor: docName,
            date,
            slot: selectedSlot
        });
    }

    // Hero Quick Form Shortcut
    const heroForm = document.getElementById('heroQuickForm');
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dept = document.getElementById('heroDept').value;
            const name = document.getElementById('heroName').value;
            const phone = document.getElementById('heroPhone').value;
            const token = 'SVV-' + Math.floor(100000 + Math.random() * 900000);

            showConfirmationModal({
                token,
                name: name || 'Valued Patient',
                phone: phone || 'Provided',
                dept: dept,
                doctor: 'Consultant on Duty',
                date: 'Today / Walk-in',
                slot: 'Priority Next Slot'
            });
        });
    }

    // ==========================================
    // MODALS & CONFIRMATION HANDLERS
    // ==========================================
    const confirmationModal = document.getElementById('confirmationModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalDetailsEl = document.getElementById('modalDetails');
    const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');

    function showConfirmationModal(details) {
        if (!confirmationModal) return;
        modalDetailsEl.innerHTML = `
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="width: 64px; height: 64px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 0.75rem;">
                    ✓
                </div>
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800; color: #0F172A;">Appointment Scheduled!</h3>
                <div style="display: inline-block; background: #0A192F; color: #38BDF8; font-family: monospace; font-size: 1.1rem; font-weight: 700; padding: 4px 16px; border-radius: 8px; margin-top: 0.5rem;">
                    Token: ${details.token}
                </div>
            </div>
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.25rem; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
                <div><strong>Patient Name:</strong> ${details.name}</div>
                <div><strong>Phone Number:</strong> ${details.phone}</div>
                <div><strong>Department:</strong> ${details.dept}</div>
                <div><strong>Doctor:</strong> ${details.doctor}</div>
                <div><strong>Date & Time:</strong> ${details.date} • ${details.slot}</div>
                <div><strong>Clinic Location:</strong> Sri Sai Balaji Complex, Arunodaya Colony, VIP Hills, Madhapur, Hyderabad</div>
            </div>
            <p style="font-size: 0.8rem; color: #64748B; text-align: center;">An SMS & WhatsApp confirmation slip has been generated. Show this token upon arrival at SVV Poly Clinic reception.</p>
        `;

        const waText = encodeURIComponent(`Hello SVV Poly Clinic Madhapur, I have booked an appointment (Token: ${details.token}) for ${details.name} with ${details.doctor} on ${details.date} at ${details.slot}. Please confirm receipt.`);
        modalWhatsAppBtn.href = `https://wa.me/919010481048?text=${waText}`;

        confirmationModal.classList.add('active');
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            confirmationModal.classList.remove('active');
        });
    }

    // Lab Booking / Home Collection Modal
    const labModal = document.getElementById('labModal');
    const labModalClose = document.getElementById('labModalClose');
    const labOrderSummary = document.getElementById('labOrderSummary');
    const labBookingForm = document.getElementById('labBookingForm');

    window.openLabBookingModal = function(items) {
        if (!labModal) return;
        const total = items.reduce((sum, item) => sum + item.price, 0);
        let itemsListHtml = items.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px dashed #E2E8F0;">
                <span>${item.name}</span>
                <strong>₹${item.price}</strong>
            </div>
        `).join('');

        labOrderSummary.innerHTML = `
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; font-size: 0.875rem;">
                <div style="font-weight: 700; color: #0F172A; margin-bottom: 0.5rem;">Selected Diagnostic Tests / Package</div>
                ${itemsListHtml}
                <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; font-size: 1.1rem; font-weight: 800; color: #0D9488;">
                    <span>Total Amount:</span>
                    <span>₹${total}</span>
                </div>
                <div style="font-size: 0.75rem; color: #16A34A; margin-top: 4px;">✓ Free Home Sample Collection in Madhapur & Hitec City</div>
            </div>
        `;

        labBookingForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('labPatientName').value.trim();
            const phone = document.getElementById('labPatientPhone').value.trim();
            const address = document.getElementById('labAddress').value.trim();
            const sampleTime = document.getElementById('labTimeSlot').value;

            const labToken = 'LAB-' + Math.floor(100000 + Math.random() * 900000);
            labModal.classList.remove('active');

            showConfirmationModal({
                token: labToken,
                name: name,
                phone: phone,
                dept: 'Home Sample Collection (Serum Lab)',
                doctor: 'Phlebotomist Assigned',
                date: 'Slot Requested: ' + sampleTime,
                slot: address ? `Address: ${address}` : 'Clinic Walk-in'
            });
        };

        labModal.classList.add('active');
    };

    if (labModalClose) {
        labModalClose.addEventListener('click', () => {
            labModal.classList.remove('active');
        });
    }

    // WhatsApp Direct Report Modal
    const reportModal = document.getElementById('reportModal');
    const reportModalClose = document.getElementById('reportModalClose');
    const openReportModalBtns = document.querySelectorAll('.open-report-modal');
    const reportForm = document.getElementById('reportForm');

    openReportModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (reportModal) reportModal.classList.add('active');
        });
    });

    if (reportModalClose) {
        reportModalClose.addEventListener('click', () => {
            reportModal.classList.remove('active');
        });
    }

    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('reportPhone').value.trim();
            const billId = document.getElementById('reportBillId').value.trim();
            const waMsg = encodeURIComponent(`Hello SVV Poly Clinic & Serum Lab, please share the test reports for Phone: ${phone}, Bill/Sample ID: ${billId || 'Recent'}. Thank you!`);
            window.open(`https://wa.me/919010481048?text=${waMsg}`, '_blank');
            reportModal.classList.remove('active');
        });
    }

    // Close modals on clicking backdrop
    [confirmationModal, labModal, reportModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });

    // ==========================================
    // FAQS ACCORDION
    // ==========================================
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
        const trigger = card.querySelector('.faq-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                const isOpen = card.classList.contains('open');
                faqCards.forEach(c => c.classList.remove('open'));
                if (!isOpen) {
                    card.classList.add('open');
                }
            });
        }
    });
});
