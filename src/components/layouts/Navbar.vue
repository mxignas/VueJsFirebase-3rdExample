<template>
    <div class="navbar">
        <nav class="deep-purple darken-1">
            <div class="container">
                <router-link :to=" { name: 'GMap' } " class="brand-logo left">GeoNinjas!</router-link>
                <ul class="right">
                    <li v-if="!user"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
                    <li v-if="!user"><router-link :to="{ name: 'Login' }">Login</router-link></li> <!-- v-if user, is for not to show those links when user is not logged in -->
                    <li v-if="user"> <a> {{ user.email}} </a></li>
                    <li v-if="user"><a @click="logout">Logout</a></li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'Navbar',
    data() {
        return {
            user: null
    }
},
methods: {
    logout() {
        firebase.auth().signOut().then(() => {
            this.$router.push({ name: 'Login' })
        })
    }
},
created() {
    // check state of user
    firebase.auth().onAuthStateChanged((user) => {
        // if this is true, user is logged in
        if(user) {
            this.user = user
        } else {
            this.user = null
        }
    })
}
}
</script>