const AppList = {
    name: 'app-list',
    template: `
      <vs-list>
        <!-- 
          Use the <template slot="title"/> passed from the parent.
          Cannot use <slot name="title"/> as we have to pass it to the 'vs-title' prop.
        -->
        <vs-list-header :vs-title="$slots.title[0].text" vs-color="primary"/>

        <!-- add custom class "list-item" -->
        <vs-list-item v-for="(item, index) of list" :key="index"
            vs-icon="check" :vs-title="item" :vs-subtitle="''+index" class="list-item">
            <vs-button vs-color="danger" vs-icon="save_alt" @click="download(index)">Download</vs-button>
        </vs-list-item>
      </vs-list>
    `,
    props: ['list'],
    data() {
        return {
        };
    },
    methods: {
        download(index) {
            console.log('Download', this.list[index]);
        }
    }
};