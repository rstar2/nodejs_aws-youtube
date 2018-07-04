const Snackbar = {
    name: 'Snackbar',
    template: html`
        <v-snackbar :timeout="timeout" :color="color" v-model="active">
            {{ text }}
            <v-icon dark left @click="close">close</v-icon>
        </v-snackbar>
    `,
    props: {
        global: {
            type: Boolean,
        },
    },
    data() {
        return Object.assign({ active: false, }, this.getDefaults());
    },
    methods: {
        getDefaults() {
            return {
                text: '',
                icon: '',
                color: 'info',
                timeout: 3000,
            };
        },

        show(options = {}) {
            if (this.active) {
                this.close();
                this.$nextTick(() => this.show(options));
                return;
            }

            Object.assign(this, this.getDefaults(), options);
            this.active = true;
        },

        close() {
            this.active = false;
        },
    },

    // Register the global Snackbar component to be available in all Vue components
    created() {
        if (this.global) {
            if (Vue.prototype.$snackbar) {
                console.log(`Only one global "Snackbar" component must be created,
                second one is discarded (made not global)`);
                this.global = false;
            } else {
                Vue.prototype.$snackbar = this;
            }

        }
    },
    beforeDestroy() {
        // if the component containing the Snackbar component is destroyed 
        if (this.global) {
            Vue.prototype.$snackbar = null;
        }
    }
};

// create as plugin
Snackbar.install = function (Vue) {
    // Register the Snackbar component
    Vue.component('Snackbar', Snackbar);
};


// register the plugin
Vue.use(Snackbar.install);





