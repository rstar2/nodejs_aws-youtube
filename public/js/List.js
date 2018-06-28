let AppList = {
    name: 'app-list',
    template: `
      <vs-list>
        <vs-list-header vs-icon="check" vs-title="List with MP4" vs-color="primary"></vs-list-header>
        <vs-list-item v-for="(item, index) of listMp4" :key="index"
            vs-icon="check" :vs-title="item" :vs-subtitle="''+index">
            <vs-button vs-color="danger" vs-icon="save_alt" @click="download(index)">Download</vs-button>
        </vs-list-item>    
      </vs-list>
    `,
    // HTML attribute names are case-insensitive, so browsers will interpret any uppercase characters
    // as lowercase. That means when you’re using in-DOM templates
    // camelCased prop names need to use their kebab-cased (hyphen-delimited) equivalents:
    // e,g : <app-list :list-mp4="listMP4" :list-mp3="listMP3"></app-list>
    props: ['listMp4', 'listMp3'],
    data() {
        return {
        };
    },
    methods: {
        download(index, isMP3 = false) {
            console.log('Download', (isMP3 ? this.listMp3 : this.listMp4)[index]);
        }
    }
};