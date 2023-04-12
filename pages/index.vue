<template>
    <div class="app">
        <v-container>
            <v-card class="text-card mb-4">
                <v-card-text>
                    Lorem ipsum
                </v-card-text>
            </v-card>

            <v-card class="mb-4">
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6" class="mb-4">
                            <v-img src="https://picsum.photos/2137/2137?random=1" aspect-ratio="1" class="image"></v-img>
                        </v-col>
                        <v-col cols="12" sm="6" class="mb-4">
                            <v-card class="description-card">
                                <v-card-text>
                                    Opis
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card class="mb-4">
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6" class="mb-4">
                            <v-img src="https://picsum.photos/2137/2137?random=2" aspect-ratio="1" class="image"></v-img>
                        </v-col>
                        <v-col cols="12" sm="6" class="mb-4">
                            <v-card class="description-card">
                                <v-card-text>
                                    Opis
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>