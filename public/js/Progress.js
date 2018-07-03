//eslint-disable-next-line
const Progress = {
    template: html`
    <v-layout row>
        <v-flex xs12 sm8 offset-sm2>
            <v-progress-linear :indeterminate="!state.status"></v-progress-linear>
            <v-alert :value="state.status" :type="alertType"> {{state.status}} </v-alert>
        </v-flex>
    </v-layout>
    `,
    props: {
        state: {
            type: Object,
            default: {
                status: null,
                isError: false
            }
        }
    },
    computed: {
        alertType() {
            return this.state.isError ? 'error' : 'info';
        }
    }
};