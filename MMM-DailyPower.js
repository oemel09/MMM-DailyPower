Module.register('MMM-DailyPower', {
    defaults: {
        width: '75%',
        margin: '0 auto',
        translation: 'de',
        verseColor: '#ccc',
        referenceColor: '#ccc',
        showImage: true,
        blackAndWhite: true,
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === 'MODULE_DOM_CREATED') {
            const payload = {
                translation: this.config.translation
            };

            this.sendSocketNotification('DAILY_POWER_LOAD_VERSE', payload);
            setInterval(() => {
                this.sendSocketNotification('DAILY_POWER_LOAD_VERSE', payload);
            }, 1000 * 60 * 60);
        }
    },

    getStyles: function() {
        return [
            'styles.css'
        ];
    },

    getDom: function() {
        const wrapper = document.createElement('div');
        wrapper.style.width = this.config.width;
        wrapper.style.margin = this.config.margin;
        if (this.verse) {
            if (this.config.showImage) {
                wrapper.appendChild(this.createVerseImage());
            }
            wrapper.appendChild(this.createVerseCard());
        } else {
            wrapper.innerHTML = this.translate('LOADING');
        }
        return wrapper;
    },

    createVerseImage: function() {
        const imageUrl = this.verse.image;
        let image = document.createElement('img');
        image.classList.add('image');
        if (this.config.blackAndWhite) {
            image.classList.add('blackAndWhite');
        }
        image.src = imageUrl;
        return image;
    },

    createVerseCard: function() {
        const card = document.createElement('div');
        card.classList.add('card');
        const content = document.createElement('p');
        content.classList.add('content');
        content.style.color = this.config.verseColor;
        content.innerHTML = this.verse.content;
        const reference = document.createElement('p');
        reference.classList.add('reference');
        reference.style.color = this.config.referenceColor;
        reference.innerHTML = this.verse.reference;
        card.appendChild(content);
        card.appendChild(reference);
        return card;
    },

    socketNotificationReceived: function(notification, payload) {
        Log.log(notification, payload);
        if (notification === 'DAILY_POWER_ON_VERSE_RECEIVED') {
            this.verse = payload[0];
            this.updateDom();
        }
    }

});
