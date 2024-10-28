new Vue({
    el: '#app',
    data: {
        activeIndex: 0,
        services: [
            {
                title: 'Plugins Minecraft',
                description: 'Découvrez nos plugins uniques pour améliorer votre expérience Minecraft.',
            },
            {
                title: 'Sites Internet',
                description: 'Nous créons des sites web modernes pour vos projets.',
            },
            {
                title: 'Bots Discord',
                description: 'Automatisez votre serveur Discord avec nos bots personnalisés.',
            },
        ],
    },
    methods: {
        nextService() {
            this.activeIndex = (this.activeIndex + 1) % this.services.length;
        },
        prevService() {
            this.activeIndex = (this.activeIndex - 1 + this.services.length) % this.services.length;
        },
    },
});
