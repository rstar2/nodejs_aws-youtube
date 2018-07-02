const AppList = {
    template: `
        <v-app>
            <List :list="list">
                <template slot="title">{{ title }}</template>
            </List>
        </v-app>
    `,
    props: ['list', 'title'],
    components: {
        List
    }
};