export default class Form{
    constructor(forms) {
        this.forms = document.querySelectorAll(forms);
        this.inputs = document.querySelectorAll('input');
        this.message = {
            loading: 'Загрузка...',
            success: 'Спасибо! Скоро мы с вами свяжемяся!',
            failure: 'Что-то пошло не так...' 
        };
        this.path = 'assets/question.php';
    }

    async postData(url, data) {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await res.text();
    }

    initMask() {
        let setCursorPosition = (position, element) => {

            element.focus();
            // element.addEventListener('click', () => {
            //     element.setSelectionRange(position, position);
            // });
    
            if (element.setSelectionRange) {
                element.setSelectionRange(position, position);
            } else if (element.createTextRange) {
                let range = element.createTextRange();
    
                range.collapse(true);
                range.moveEnd('character', position);
                range.moveStart('character', position);
                range.select();
            }
        };
    
        function createMask(event) {
            let matrix = '+1 (___) ___-____',
                i = 0,
                def = matrix.replace(/\D/g, ''),
                value = this.value.replace(/\D/g, '');
    
            if (def.length >= value.length) {
                value = def;
            }
    
            this.value = matrix.replace(/./g, function(a) {
                return /[_\d]/.test(a) && i < value.length ? value.charAt(i++) : i >= value.length ? '' : a;
            });
    
            if (event.type === 'blur') {
                if (this.value.length == 2) {
                    this.value = '';
                }
            } else {
                
                this.addEventListener('click', () => {
                    setCursorPosition(this.value.length, this);
                });
            }
        }
    
        let inputs = document.querySelectorAll('[name="phone"]');
    
        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });
    }

    // Очистка input
    clearInputs() {
       this.inputs.forEach(item => {
            item.value = '';
       });
    }

    // Валидация ввода email
    checkMailInputs() {
        const mailInputs = document.querySelectorAll('[type="email"]');

        mailInputs.forEach(input => {
            input.addEventListener('keypress', function(event) {
                if (event.key.match(/[^a-z 0-9 @ \.]/ig)) {
                    event.preventDefault();
                }
            });
        });
    }

    init() {
        this.initMask();
        this.checkMailInputs();
        this.forms.forEach(item => {
            item.addEventListener('submit', (event) => {
                event.preventDefault();

                let statusMessage = document.createElement('div');
                statusMessage.style.cssText = `
                    margin-top: 15px;
                    font-size: 18px;
                    color: grey;
                `;
                item.parentNode.appendChild(statusMessage);

                statusMessage.textContent = this.message.loading;

                const formData = new FormData(item);

                this.postData(this.path, formData)
                    .then(res => {
                        console.log(res);
                        statusMessage.textContent = this.message.success;
                    })
                    .catch(() => {
                        statusMessage.textContent = this.message.failure;
                    })
                    .finally(() => {
                        this.clearInputs();
                        setTimeout(() => {
                            statusMessage.remove();
                        }, 6000);
                    });
            });
        });
    }
}