
    // تهيئة Firebase
    const auth = firebase.auth();
    const database = firebase.database();
    const storage = firebase.storage();

    // متغيرات التطبيق
    let currentUser = null;
    let selectedAvatar = null;
    let selectedUsername = null;
    let currentChat = null;
    let contacts = [];
    let blockedUsers = [];

    // عناصر واجهة المستخدم
    const loadingScreen = document.getElementById('loading-screen');
    const authContainer = document.getElementById('auth-container');
    const setupContainer = document.getElementById('setup-container');
    const chatContainer = document.getElementById('chat-container');
    const profileModal = document.getElementById('profile-modal');
    const attachmentModal = document.getElementById('attachment-modal');
    const blockModal = document.getElementById('block-modal');

    // عناصر المصادقة
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const signupEmail = document.getElementById('signup-email');
    const signupPhone = document.getElementById('signup-phone');
    const signupPassword = document.getElementById('signup-password');
    const signupConfirmPassword = document.getElementById('signup-confirm-password');

    // عناصر إعداد الملف
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const usernameInput = document.getElementById('username');
    const usernameCheck = document.getElementById('username-check');
    const usernameError = document.getElementById('username-error');
    const completeBtn = document.getElementById('complete-btn');
    const uploadAvatarBtn = document.getElementById('upload-avatar-btn');
    const avatarUpload = document.getElementById('avatar-upload');
    const modalUploadAvatarBtn = document.getElementById('modal-upload-avatar-btn');
    const modalAvatarUpload = document.getElementById('modal-avatar-upload');

    // عناصر الدردشة
    const sidebar = document.getElementById('sidebar');
    const userAvatar = document.getElementById('user-avatar');
    const userUsername = document.getElementById('user-username');
    const userStatus = document.getElementById('user-status');
    const searchInput = document.getElementById('search-input');
    const contactsList = document.getElementById('contacts-list');
    const chatHeader = document.getElementById('chat-header');
    const messagesContainer = document.getElementById('messages-container');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const attachmentBtn = document.getElementById('attachment-btn');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const backToContactsBtn = document.getElementById('back-to-contacts');

    // عناصر تعديل الملف
    const closeModalBtn = document.querySelector('.close-modal');
    const modalAvatarOptions = document.querySelectorAll('.modal .avatar-option');
    const modalUsername = document.getElementById('modal-username');
    const modalStatus = document.getElementById('modal-status');
    const saveProfileBtn = document.getElementById('save-profile-btn');

    // عناصر المرفقات
    const sendPhoto = document.getElementById('send-photo');
    const sendVideo = document.getElementById('send-video');
    const sendAudio = document.getElementById('send-audio');
    const sendFile = document.getElementById('send-file');
    const photoInput = document.getElementById('photo-input');
    const videoInput = document.getElementById('video-input');
    const audioInput = document.getElementById('audio-input');
    const fileInput = document.getElementById('file-input');

    // عناصر حظر المستخدم
    const confirmBlockBtn = document.getElementById('confirm-block-btn');

    // عرض شاشة التحميل
    function showLoading() {
        loadingScreen.style.display = 'flex';
    }

    // إخفاء شاشة التحميل
    function hideLoading() {
        loadingScreen.style.display = 'none';
    }

    // عرض شاشة المصادقة
    function showAuthScreen() {
        authContainer.classList.remove('hidden');
        setupContainer.classList.add('hidden');
        chatContainer.classList.add('hidden');
        profileModal.classList.remove('active');
        attachmentModal.classList.remove('active');
        blockModal.classList.remove('active');
    }

    // عرض شاشة الإعداد
    function showSetupScreen() {
        authContainer.classList.add('hidden');
        setupContainer.classList.remove('hidden');
        chatContainer.classList.add('hidden');
        profileModal.classList.remove('active');
    }

    // عرض شاشة الدردشة
    function showChatScreen() {
        authContainer.classList.add('hidden');
        setupContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        profileModal.classList.remove('active');
    }

    // فتح نافذة تعديل الملف
    function openProfileModal() {
        profileModal.classList.add('active');
    }

    // إغلاق نافذة تعديل الملف
    function closeProfileModal() {
        profileModal.classList.remove('active');
    }

    // فتح نافذة المرفقات
    function openAttachmentModal() {
        attachmentModal.classList.add('active');
    }

    // إغلاق نافذة المرفقات
    function closeAttachmentModal() {
        attachmentModal.classList.remove('active');
    }

    // فتح نافذة حظر المستخدم
    function openBlockModal() {
        blockModal.classList.add('active');
    }

    // إغلاق نافذة حظر المستخدم
    function closeBlockModal() {
        blockModal.classList.remove('active');
    }

    // تبديل بين تسجيل الدخول وإنشاء حساب
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    // اختيار صورة رمزية
    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedAvatar = option.dataset.avatar;
        });
    });

    // رفع صورة من الجهاز
    uploadAvatarBtn.addEventListener('click', () => {
        avatarUpload.click();
    });

    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // إلغاء تحديد أي أفاتار محدد مسبقاً
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                
                // إنشاء عنصر صورة جديد للصورة المرفوعة
                const customAvatar = document.createElement('div');
                customAvatar.className = 'avatar-option selected';
                customAvatar.dataset.avatar = 'custom';
                customAvatar.innerHTML = `<img src="${event.target.result}" alt="Custom Avatar">`;
                
                // إضافة الصورة المرفوعة إلى الشبكة
                const avatarGrid = document.querySelector('.avatar-grid');
                avatarGrid.appendChild(customAvatar);
                
                // تحديد الصورة المرفوعة
                selectedAvatar = 'custom';
                
                // إضافة حدث النقر للصورة الجديدة
                customAvatar.addEventListener('click', () => {
                    avatarOptions.forEach(opt => opt.classList.remove('selected'));
                    customAvatar.classList.add('selected');
                    selectedAvatar = 'custom';
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // التحقق من اسم المستخدم
    usernameInput.addEventListener('input', async () => {
        const username = usernameInput.value.trim();
        
        if (username.length < 3) {
            usernameError.textContent = 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل';
            usernameCheck.classList.add('hidden');
            return;
        }
        
        if (!/^[a-z0-9_]+$/.test(username)) {
            usernameError.textContent = 'يمكن استخدام الأحرف الإنجليزية الصغيرة، الأرقام والشرطة السفلية فقط';
            usernameCheck.classList.add('hidden');
            return;
        }
        
        // التحقق من توفر اسم المستخدم
        const snapshot = await database.ref('usernames/' + username).once('value');
        
        if (snapshot.exists()) {
            usernameError.textContent = 'اسم المستخدم محجوز بالفعل';
            usernameCheck.classList.add('hidden');
        } else {
            usernameError.textContent = '';
            usernameCheck.classList.remove('hidden');
            selectedUsername = username;
        }
    });

    // إكمال إعداد الملف
    completeBtn.addEventListener('click', async () => {
        if (!selectedAvatar) {
            alert('الرجاء اختيار صورة رمزية');
            return;
        }
        
        if (!selectedUsername) {
            alert('الرجاء اختيار اسم مستخدم صالح');
            return;
        }
        
        showLoading();
        
        try {
            let avatarData = {
                avatar: selectedAvatar
            };
            
            // إذا كانت الصورة مرفوعة من الجهاز
            if (selectedAvatar === 'custom' && avatarUpload.files[0]) {
                const file = avatarUpload.files[0];
                const storageRef = storage.ref(`avatars/${currentUser.uid}/${file.name}`);
                
                // رفع الصورة إلى التخزين
                const snapshot = await storageRef.put(file);
                const downloadURL = await snapshot.ref.getDownloadURL();
                
                avatarData.avatar = 'custom';
                avatarData.customAvatarUrl = downloadURL;
            }
            
            // حفظ بيانات المستخدم
            await database.ref('users/' + currentUser.uid).set({
                ...avatarData,
                username: selectedUsername,
                email: currentUser.email,
                phone: currentUser.phoneNumber || '',
                status: 'متصل الآن',
                isOnline: true,
                createdAt: Date.now(),
                lastSeen: null
            });
            
            // حفظ اسم المستخدم للتحقق من التكرار
            await database.ref('usernames/' + selectedUsername).set(currentUser.uid);
            
            // تحميل شاشة الدردشة
            loadUserData();
            showChatScreen();
        } catch (error) {
            console.error('Error completing setup:', error);
            alert('حدث خطأ أثناء إعداد الملف الشخصي');
        } finally {
            hideLoading();
        }
    });

    // تسجيل الدخول
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();
        
        if (!email || !password) {
            alert('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }
        
        showLoading();
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
            // سيتم توجيه المستخدم تلقائياً via onAuthStateChanged
        } catch (error) {
            console.error('Login error:', error);
            alert('خطأ في تسجيل الدخول: ' + error.message);
            hideLoading();
        }
    });

    // إنشاء حساب
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = signupEmail.value.trim();
        const phone = signupPhone.value.trim();
        const password = signupPassword.value.trim();
        const confirmPassword = signupConfirmPassword.value.trim();
        
        if (!email || !password || !confirmPassword) {
            alert('الرجاء إكمال جميع الحقول المطلوبة');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('كلمة المرور غير متطابقة');
            return;
        }
        
        if (password.length < 6) {
            alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }
        
        showLoading();
        
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            // سيتم توجيه المستخدم تلقائياً via onAuthStateChanged
        } catch (error) {
            console.error('Signup error:', error);
            alert('خطأ في إنشاء الحساب: ' + error.message);
            hideLoading();
        }
    });

    // تحميل بيانات المستخدم
    function loadUserData() {
        // تحديث حالة المستخدم إلى متصل
        const userRef = database.ref('users/' + currentUser.uid);
        
        userRef.update({
            status: 'متصل الآن',
            isOnline: true,
            lastSeen: null
        });
        
        // إضافة مستمع لتحديثات الحالة
        userRef.on('value', snapshot => {
            const userData = snapshot.val();
            if (userData) {
                // عرض الأفاتار
                if (userData.avatar === 'custom' && userData.customAvatarUrl) {
                    userAvatar.src = userData.customAvatarUrl;
                } else {
                    userAvatar.src = `https://i.pravatar.cc/150?img=${userData.avatar || '1'}`;
                }
                
                userUsername.textContent = `@${userData.username}`;
                
                // عرض حالة الاتصال
                if (userData.isOnline) {
                    userStatus.textContent = 'متصل الآن';
                    userStatus.style.color = 'var(--success-color)';
                } else {
                    const lastSeen = userData.lastSeen ? new Date(userData.lastSeen).toLocaleString() : 'غير معروف';
                    userStatus.textContent = `آخر ظهور: ${lastSeen}`;
                    userStatus.style.color = 'var(--gray-color)';
                }
                
                // تحميل جهات الاتصال
                loadContacts();
            }
        });
        
        // تحديث حالة الاتصال عند الخروج
        const handleBeforeUnload = () => {
            userRef.update({
                isOnline: false,
                lastSeen: Date.now()
            });
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // تنظيف المستمع عند تسجيل الخروج
        logoutBtn.addEventListener('click', () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        });
    }

    // تحميل جهات الاتصال
    function loadContacts() {
        database.ref('users').on('value', snapshot => {
            contacts = [];
            contactsList.innerHTML = '';
            
            if (snapshot.exists()) {
                snapshot.forEach(userSnapshot => {
                    if (userSnapshot.key !== currentUser.uid) {
                        const user = userSnapshot.val();
                        
                        // التحقق مما إذا كان المستخدم محظوراً
                        const isBlocked = blockedUsers.includes(userSnapshot.key);
                        
                        if (!isBlocked) {
                            contacts.push({
                                id: userSnapshot.key,
                                ...user
                            });
                            
                            const contactItem = document.createElement('div');
                            contactItem.className = 'contact-item';
                            contactItem.dataset.userId = userSnapshot.key;
                            
                            contactItem.innerHTML = `
                                <div class="online-status ${user.isOnline ? '' : 'offline'}"></div>
                                <img src="https://i.pravatar.cc/150?img=${user.avatar || '1'}" alt="${user.username}">
                                <div class="contact-info">
                                    <h3>@${user.username}</h3>
                                    <p>${user.status || 'لا توجد حالة'}</p>
                                </div>
                                <div class="contact-actions">
                                    <button class="block-btn" data-user-id="${userSnapshot.key}">
                                        <i class="fas fa-ban"></i>
                                    </button>
                                </div>
                            `;
                            
                            contactItem.addEventListener('click', () => {
                                openChat(userSnapshot.key, user);
                            });
                            
                            const blockBtn = contactItem.querySelector('.block-btn');
                            blockBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                openBlockModal();
                                confirmBlockBtn.dataset.userId = userSnapshot.key;
                            });
                            
                            contactsList.appendChild(contactItem);
                        }
                    }
                });
            }
            
            if (contacts.length === 0) {
                contactsList.innerHTML = `
                    <div class="empty-contacts">
                        <i class="fas fa-users"></i>
                        <p>لا يوجد مستخدمون متاحون</p>
                    </div>
                `;
            }
        });
    }

    // فتح دردشة مع مستخدم
    function openChat(userId, userData) {
        currentChat = {
            id: userId,
            ...userData
        };
        
        // إخفاء القائمة الجانبية على الهاتف
        if (window.innerWidth <= 768) {
            sidebar.classList.add('hidden-mobile');
        }
        
        // تحديث رأس الدردشة مع زر العودة
        chatHeader.innerHTML = `
            <button class="back-to-contacts" id="back-to-contacts">
                <i class="fas fa-arrow-left"></i>
            </button>
            <div class="chat-partner">
                <img src="https://i.pravatar.cc/150?img=${userData.avatar || '1'}" alt="${userData.username}">
                <div class="chat-partner-info">
                    <h3>@${userData.username}</h3>
                    <small>${userData.isOnline ? 'متصل الآن' : 'غير متصل'}</small>
                </div>
            </div>
            <div class="chat-actions">
                <button class="block-btn" id="block-user-btn" data-user-id="${userId}">
                    <i class="fas fa-ban"></i>
                </button>
                <button class="delete-chat-btn" id="delete-chat-btn" data-user-id="${userId}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // تمكين إدخال الرسائل
        messageInput.disabled = false;
        sendBtn.disabled = false;
        
        // إضافة أحداث للأزرار الجديدة
        document.getElementById('back-to-contacts').addEventListener('click', () => {
            sidebar.classList.remove('hidden-mobile');
            chatHeader.innerHTML = `
                <div class="empty-chat">
                    <i class="fas fa-comment-dots"></i>
                    <h2>مرحبًا بك في دردشة فايرباس</h2>
                    <p>اختر محادثة لبدء الدردشة</p>
                </div>
            `;
            currentChat = null;
            messageInput.disabled = true;
            sendBtn.disabled = true;
        });
        
        document.getElementById('block-user-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openBlockModal();
            confirmBlockBtn.dataset.userId = userId;
        });
        
        document.getElementById('delete-chat-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('هل أنت متأكد أنك تريد حذف هذه المحادثة؟')) {
                deleteChat(userId);
            }
        });
        
        // تحميل الرسائل
        loadMessages(userId);
    }

    // حذف محادثة
    function deleteChat(userId) {
        const chatId = generateChatId(currentUser.uid, userId);
        
        showLoading();
        
        database.ref('chats/' + chatId).remove()
            .then(() => {
                // تحديث واجهة المستخدم
                messagesContainer.innerHTML = `
                    <div class="empty-messages">
                        <i class="fas fa-comment-alt"></i>
                        <p>تم حذف المحادثة</p>
                    </div>
                `;
                
                // العودة إلى قائمة المحادثات
                sidebar.classList.remove('hidden-mobile');
                chatHeader.innerHTML = `
                    <div class="empty-chat">
                        <i class="fas fa-comment-dots"></i>
                        <h2>مرحبًا بك في دردشة فايرباس</h2>
                        <p>اختر محادثة لبدء الدردشة</p>
                    </div>
                `;
                currentChat = null;
                messageInput.disabled = true;
                sendBtn.disabled = true;
            })
            .catch(error => {
                console.error('Error deleting chat:', error);
                alert('حدث خطأ أثناء حذف المحادثة');
            })
            .finally(() => {
                hideLoading();
            });
    }

    // تحميل الرسائل
    function loadMessages(userId) {
        const chatId = generateChatId(currentUser.uid, userId);
        
        database.ref('chats/' + chatId + '/messages').on('value', snapshot => {
            messagesContainer.innerHTML = '';
            
            if (snapshot.exists()) {
                const messages = [];
                
                snapshot.forEach(messageSnapshot => {
                    messages.push({
                        id: messageSnapshot.key,
                        ...messageSnapshot.val()
                    });
                });
                
                // ترتيب الرسائل حسب التاريخ
                messages.sort((a, b) => a.timestamp - b.timestamp);
                
                // عرض الرسائل
                messages.forEach(message => {
                    displayMessage(message, message.senderId === currentUser.uid);
                });
                
                // التمرير إلى آخر رسالة
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else {
                messagesContainer.innerHTML = `
                    <div class="empty-messages">
                        <i class="fas fa-comment-alt"></i>
                        <p>ابدأ المحادثة مع @${currentChat.username}</p>
                    </div>
                `;
            }
        });
    }

    // عرض رسالة
    function displayMessage(message, isSent) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isSent ? 'sent' : 'received'}`;
        
        const time = new Date(message.timestamp);
        const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let content = '';
        
        if (message.type === 'text') {
            content = message.text;
        } else if (message.type === 'image') {
            content = `<img src="${message.url}" alt="صورة مرسلة" style="max-width: 100%; border-radius: 8px;">`;
        } else if (message.type === 'video') {
            content = `<video controls src="${message.url}" style="max-width: 100%; border-radius: 8px;"></video>`;
        } else if (message.type === 'audio') {
            content = `<audio controls src="${message.url}" style="width: 100%;"></audio>`;
        } else if (message.type === 'file') {
            content = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-file" style="font-size: 24px;"></i>
                    <div>
                        <a href="${message.url}" target="_blank" style="color: ${isSent ? 'white' : 'var(--primary-color)'}; font-weight: bold;">
                            ${message.filename || 'ملف'}
                        </a>
                        <div style="font-size: 12px;">${formatFileSize(message.size)}</div>
                    </div>
                </div>
            `;
        }
        
        messageElement.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${timeString}</div>
            <div class="message-actions">
                <div class="message-action delete" data-message-id="${message.id}">
                    <i class="fas fa-trash"></i> حذف
                </div>
            </div>
        `;
        
        // إضافة حدث حذف الرسالة
        const deleteBtn = messageElement.querySelector('.message-action.delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('هل أنت متأكد أنك تريد حذف هذه الرسالة؟')) {
                deleteMessage(message.id);
            }
        });
        
        messagesContainer.appendChild(messageElement);
    }

    // تنسيق حجم الملف
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 بايت';
        const k = 1024;
        const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // حذف رسالة
    function deleteMessage(messageId) {
        const chatId = generateChatId(currentUser.uid, currentChat.id);
        
        database.ref(`chats/${chatId}/messages/${messageId}`).remove()
            .catch(error => {
                console.error('Error deleting message:', error);
                alert('حدث خطأ أثناء حذف الرسالة');
            });
    }

    // إرسال رسالة
    function sendMessage() {
        const text = messageInput.value.trim();
        
        if (!text || !currentChat) return;
        
        const chatId = generateChatId(currentUser.uid, currentChat.id);
        const message = {
            text: text,
            senderId: currentUser.uid,
            timestamp: Date.now(),
            type: 'text'
        };
        
        // إضافة الرسالة إلى قاعدة البيانات
        database.ref('chats/' + chatId + '/messages').push(message)
            .then(() => {
                // تحديث آخر نشاط في الدردشة
                updateChatActivity(chatId);
                
                // مسح حقل الإدخال
                messageInput.value = '';
            })
            .catch(error => {
                console.error('Error sending message:', error);
                alert('حدث خطأ أثناء إرسال الرسالة');
            });
    }

    // إرسال مرفق
    function sendAttachment(file, type) {
        if (!file || !currentChat) return;
        
        showLoading();
        
        const chatId = generateChatId(currentUser.uid, currentChat.id);
        const storageRef = storage.ref(`attachments/${currentUser.uid}/${Date.now()}_${file.name}`);
        
        storageRef.put(file).then(snapshot => {
            return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {
            const message = {
                senderId: currentUser.uid,
                timestamp: Date.now(),
                type: type,
                url: downloadURL
            };
            
            if (type === 'file') {
                message.filename = file.name;
                message.size = file.size;
            }
            
            return database.ref('chats/' + chatId + '/messages').push(message);
        }).then(() => {
            // تحديث آخر نشاط في الدردشة
            updateChatActivity(chatId);
            closeAttachmentModal();
        }).catch(error => {
            console.error('Error sending attachment:', error);
            alert('حدث خطأ أثناء إرسال المرفق');
        }).finally(() => {
            hideLoading();
        });
    }

    // إنشاء معرف دردشة فريد
    function generateChatId(userId1, userId2) {
        return [userId1, userId2].sort().join('_');
    }

    // تحديث نشاط الدردشة
    function updateChatActivity(chatId) {
        const updates = {};
        updates[`userChats/${currentUser.uid}/${chatId}/lastActivity`] = Date.now();
        updates[`userChats/${currentChat.id}/${chatId}/lastActivity`] = Date.now();
        
        database.ref().update(updates);
    }

    // البحث عن مستخدمين
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            loadContacts();
            return;
        }
        
        // إزالة علامة @ إذا كانت موجودة
        const cleanSearchTerm = searchTerm.replace('@', '');
        
        const filteredContacts = contacts.filter(contact => 
            contact.username.toLowerCase().includes(cleanSearchTerm) &&
            !blockedUsers.includes(contact.id)
        );
        
        contactsList.innerHTML = '';
        
        if (filteredContacts.length > 0) {
            filteredContacts.forEach(contact => {
                const contactItem = document.createElement('div');
                contactItem.className = 'contact-item';
                contactItem.dataset.userId = contact.id;
                
                contactItem.innerHTML = `
                    <div class="online-status ${contact.isOnline ? '' : 'offline'}"></div>
                    <img src="https://i.pravatar.cc/150?img=${contact.avatar || '1'}" alt="${contact.username}">
                    <div class="contact-info">
                        <h3>@${contact.username}</h3>
                        <p>${contact.status || 'لا توجد حالة'}</p>
                    </div>
                    <div class="contact-actions">
                        <button class="block-btn" data-user-id="${contact.id}">
                            <i class="fas fa-ban"></i>
                        </button>
                    </div>
                `;
                
                contactItem.addEventListener('click', () => {
                    openChat(contact.id, contact);
                });
                
                const blockBtn = contactItem.querySelector('.block-btn');
                blockBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openBlockModal();
                    confirmBlockBtn.dataset.userId = contact.id;
                });
                
                contactsList.appendChild(contactItem);
            });
        } else {
            contactsList.innerHTML = `
                <div class="empty-contacts">
                    <i class="fas fa-search"></i>
                    <p>لا توجد نتائج للبحث</p>
                </div>
            `;
        }
    });

    // إرسال رسالة عند الضغط على Enter
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // إرسال رسالة عند النقر على الزر
    sendBtn.addEventListener('click', sendMessage);

    // فتح نافذة المرفقات
    attachmentBtn.addEventListener('click', openAttachmentModal);

    // إرسال صورة
    sendPhoto.addEventListener('click', (e) => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            sendAttachment(file, 'image');
        }
    });

    // إرسال فيديو
    sendVideo.addEventListener('click', () => {
        videoInput.click();
    });

    videoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            sendAttachment(file, 'video');
        }
    });

    // إرسال تسجيل صوتي
    sendAudio.addEventListener('click', () => {
        audioInput.click();
    });

    audioInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            sendAttachment(file, 'audio');
        }
    });

    // إرسال ملف
    sendFile.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            sendAttachment(file, 'file');
        }
    });

    // تعديل الملف الشخصي
    editProfileBtn.addEventListener('click', () => {
        // تحديد الأفاتار الحالي
        modalAvatarOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.avatar === userAvatar.src.split('img=')[1]) {
                option.classList.add('selected');
            }
        });
        
        // تعبئة بيانات النموذج
        modalUsername.value = userUsername.textContent.replace('@', '');
        modalStatus.value = userStatus.textContent;
        
        openProfileModal();
    });

    // رفع صورة من الجهاز في النافذة المنبثقة
    modalUploadAvatarBtn.addEventListener('click', () => {
        modalAvatarUpload.click();
    });

    modalAvatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // إلغاء تحديد أي أفاتار محدد مسبقاً
                modalAvatarOptions.forEach(opt => opt.classList.remove('selected'));
                
                // إنشاء عنصر صورة جديد للصورة المرفوعة
                const customAvatar = document.createElement('div');
                customAvatar.className = 'avatar-option selected';
                customAvatar.dataset.avatar = 'custom';
                customAvatar.innerHTML = `<img src="${event.target.result}" alt="Custom Avatar">`;
                
                // إضافة الصورة المرفوعة إلى الشبكة
                const modalAvatarGrid = document.querySelector('.modal .avatar-grid');
                modalAvatarGrid.appendChild(customAvatar);
                
                // تحديد الصورة المرفوعة
                customAvatar.addEventListener('click', () => {
                    modalAvatarOptions.forEach(opt => opt.classList.remove('selected'));
                    customAvatar.classList.add('selected');
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // حفظ التغييرات في الملف الشخصي
    saveProfileBtn.addEventListener('click', async () => {
        const selectedModalAvatar = document.querySelector('.modal .avatar-option.selected')?.dataset.avatar;
        const status = modalStatus.value.trim();
        
        showLoading();
        
        try {
            const updates = {
                status: status || 'متصل الآن'
            };
            
            if (selectedModalAvatar) {
                updates.avatar = selectedModalAvatar;
                
                // إذا كانت الصورة مرفوعة من الجهاز
                if (selectedModalAvatar === 'custom' && modalAvatarUpload.files[0]) {
                    const file = modalAvatarUpload.files[0];
                    const storageRef = storage.ref(`avatars/${currentUser.uid}/${file.name}`);
                    
                    // رفع الصورة إلى التخزين
                    const snapshot = await storageRef.put(file);
                    const downloadURL = await snapshot.ref.getDownloadURL();
                    
                    updates.avatar = 'custom';
                    updates.customAvatarUrl = downloadURL;
                }
            }
            
            await database.ref('users/' + currentUser.uid).update(updates);
            
            closeProfileModal();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('حدث خطأ أثناء تحديث الملف الشخصي');
        } finally {
            hideLoading();
        }
    });

    // حظر مستخدم
    confirmBlockBtn.addEventListener('click', async () => {
        const userId = confirmBlockBtn.dataset.userId;
        
        if (!userId) return;
        
        showLoading();
        
        try {
            // إضافة المستخدم إلى قائمة المحظورين
            await database.ref(`users/${currentUser.uid}/blockedUsers/${userId}`).set(true);
            
            // تحديث قائمة المحظورين المحلية
            if (!blockedUsers.includes(userId)) {
                blockedUsers.push(userId);
            }
            
            // إعادة تحميل جهات الاتصال
            loadContacts();
            
            // إذا كانت المحادثة مفتوحة مع المستخدم المحظور، أغلقها
            if (currentChat && currentChat.id === userId) {
                sidebar.classList.remove('hidden-mobile');
                chatHeader.innerHTML = `
                    <div class="empty-chat">
                        <i class="fas fa-comment-dots"></i>
                        <h2>مرحبًا بك في دردشة فايرباس</h2>
                        <p>اختر محادثة لبدء الدردشة</p>
                    </div>
                `;
                currentChat = null;
                messageInput.disabled = true;
                sendBtn.disabled = true;
            }
            
            closeBlockModal();
        } catch (error) {
            console.error('Error blocking user:', error);
            alert('حدث خطأ أثناء حظر المستخدم');
        } finally {
            hideLoading();
        }
    });

    // تسجيل الخروج
    logoutBtn.addEventListener('click', async () => {
        showLoading();
        
        try {
            // تحديث حالة الاتصال قبل تسجيل الخروج
            if (currentUser) {
                await database.ref('users/' + currentUser.uid).update({
                    isOnline: false,
                    lastSeen: Date.now()
                });
            }
            
            await auth.signOut();
            currentUser = null;
            showAuthScreen();
        } catch (error) {
            console.error('Logout error:', error);
            alert('حدث خطأ أثناء تسجيل الخروج');
        } finally {
            hideLoading();
        }
    });

    // إدارة النوافذ المنبثقة
    function setupModalCloseHandlers() {
        // إغلاق النوافذ عند النقر خارجها
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // إغلاق النوافذ عند النقر على زر الإغلاق
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    // متابعة حالة المصادقة
    auth.onAuthStateChanged(async user => {
        if (user) {
            currentUser = user;
            
            // تحميل قائمة المحظورين
            const blockedSnapshot = await database.ref(`users/${user.uid}/blockedUsers`).once('value');
            if (blockedSnapshot.exists()) {
                blockedUsers = Object.keys(blockedSnapshot.val());
            }
            
            // التحقق مما إذا كان المستخدم لديه ملف شخصي
            const userSnapshot = await database.ref('users/' + user.uid).once('value');
            
            if (userSnapshot.exists()) {
                // لديه ملف شخصي، انتقل إلى الدردشة
                loadUserData();
                showChatScreen();
            } else {
                // ليس لديه ملف شخصي، انتقل إلى الإعداد
                showSetupScreen();
            }
            
            hideLoading();
        } else {
            // ليس مسجلاً دخول، عرض شاشة المصادقة
            currentUser = null;
            showAuthScreen();
            hideLoading();
        }
    });

    // إخفاء شاشة التحميل بعد تحميل الصفحة
    window.addEventListener('load', () => {
        setupModalCloseHandlers();
        setTimeout(hideLoading, 1000);
    });

    // إدارة عرض القائمة الجانبية على الهاتف
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('hidden-mobile');
        }
    });