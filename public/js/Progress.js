const Progress = {
    template: `
      <v-layout row>
        <v-flex xs12 sm8 offset-sm2>
          <v-progress-linear :indeterminate="!status.isFinished"></v-progress-linear>
          <v-alert :value="!!status.error" type="error"> {{status.error}} </v-alert>
        </v-flex>
      </v-layout>
    `,
    props: {
        status: {
            type:Object,
            default: {
                isFinished: false,
                error: null
            }
        }
    },
};