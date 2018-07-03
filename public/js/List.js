//eslint-disable-next-line
const List = {
    template: html`
    <v-layout row>
        <v-flex xs12 sm8 offset-sm2>
    
            <v-toolbar color="light-blue" dark>
                <v-toolbar-side-icon></v-toolbar-side-icon>
    
                <v-toolbar-title>
                    <slot name="title">My List</slot>
                </v-toolbar-title>
    
                <v-spacer></v-spacer>
    
                <v-btn icon>
                    <v-icon>search</v-icon>
                </v-btn>
            </v-toolbar>
    
            <v-list>
                <v-list-tile v-for="(item, index) of list" :key="index" avatar @click="">
                    <v-list-tile-action>
                        <!-- Using directly the MD classes -->
                        <v-icon class="red--text text--lighten-1">check</v-icon>
                    </v-list-tile-action>
    
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item }}</v-list-tile-title>
                    </v-list-tile-content>
    
                    <v-list-tile-action>
                        <!-- <v-btn icon ripple> -->
                            <!-- Using the color attribute , finally the same as above -->
                        <v-icon color="red lighten-1" @click="$emit('download', index)">cloud_download</v-icon>
                        <!-- </v-btn> -->
                    </v-list-tile-action>
                </v-list-tile>
    
                <!-- <v-divider inset></v-divider> -->
            </v-list>
    
        </v-flex>
    </v-layout>
    `,
    props: ['list'],
};