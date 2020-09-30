<template>
    <div class="signup container">
        <form @submit.prevent="signup" class="card-panel">
            <h2 class="center deep-pruple">Signup</h2>
            <div class="field">
                <label for="email">Email:</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password:</label>
                <input type="password" name="password" v-model="password">
            </div>
            <div class="field">
                <label for="alias">Alias:</label>
                <input type="text" name="alias" v-model="alias">
            </div>
            <p v-if="feedback" class="red-text center">{{ feedback }}</p>
            <div class="field center">
                <button class="btn deep-purple">Signup</button>
            </div>
        </form>
    </div>
</template>

<script>
import slugify from 'slugify'
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'Signup',
    data() {
        return {
            email: null,
            password: null,
            alias: null,
            feedback: null,
            slug: null
        }
    },
    methods: {
        signup() {
            // slugifying alias just to use it as an ID for firebase auth and firestore
            if(this.alias && this.email && this.password) {
                this.slug = slugify(this.alias, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                let ref = db.collection('users').doc(this.slug) // this doc to the users collection
                // getting the document from collection using parameter "this.slug" taking it as an "doc" and checking if it exists
                ref.get().then(doc => {
                    if(doc.exists) {
                        this.feedback = "This alias already exists"
                    }
                    else {
                        ref.set({ // setting properties to a record in db.collections('users')
                                alias: this.alias,
                                geolocation: null
                            }).then(() => { // creating user with email and password in firebase
                                return firebase.auth().createUserWithEmailAndPassword(this.email, this.password) 
                            }).then(cred => { // getting credentials object back from it
                                return ref.update({ // updating user_uid with unique uid from firebase
                                    user_id: cred.user.uid
                                });
                        }).then(() => { // redireccting them into gmap page after creating and storing user
                            this.$router.push({ 
                                name: 'GMap' })
                        })
                        .catch(err => {
                            console.log(err)
                            this.feedback = err.message
                        })
                        this.feedback = "This alias is free to use"
                    }
                })
            } else {
                this.feedback = 'You must enter all fields'
            }
        }
    }
}
</script>

<style>
.signup {
    max-width: 400px;
    margin-top: 60px;
}
.signup h2 {
    font-size: 2.4em;
}
.signup .field {
    margin-bottom: 16px;
}
</style>