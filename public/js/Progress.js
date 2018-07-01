const AppProgress = {
    name: 'app-progress',
    template: `
      <v-layout row>
        <v-flex xs12 sm8 offset-sm2>
          <v-progress-linear :indeterminate="!isFinished"></v-progress-linear>
          <v-alert :value="!!error" type="error"> {{error}} </v-alert>
        </v-flex>
      </v-layout>
    `,
    data() {
        return {
            isFinished: false,
            error: null
        };
    },
    mounted() {
        setTimeout(() => { this.isFinished = true; this.error = "Ups - failed"; }, 15000);
    },
    methods: {

    }
};