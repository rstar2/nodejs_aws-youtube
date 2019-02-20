//eslint-disable-next-line
const Youtube = {
    template: html`
    <v-layout row>
        <v-flex xs12 sm8 offset-sm2>
            <div  class="youtubeWrapper">
                <!-- NOTE!!! 
                    Since Vue 2.0 passing even string values to attributes have to be done using data binding
                    not interpolation, e.g not src="https://www.youtube.com/embed/{{videoId}} but 
                        :src="'https://www.youtube.com/embed/' + videoId"
                -->
                <iframe allow="autoplay; encrypted-media" allowfullscreen frameborder="0"
                     :src="'https://www.youtube.com/embed/' + this.videoId"/>
            </div>
        </v-flex>
    </v-layout>
    `,
    props: ['videoId'],
};