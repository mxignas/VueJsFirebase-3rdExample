<template>
    <div class="view-profile container">
        <div v-if="profile" class="card"> <!-- only when profile is retrieved -->
            <h2 class="deep-purple-text center">{{ profile.alias }}'s' Wall</h2>
    <ul class="comments collection">
        <li v-for="(comment, index) in comments" :key="index">
            <div class="deep-purple-text">{{ comment.from }} </div>
            <div class="grey-text text-darken-2"> {{ comment.content }} </div>
        </li>
    </ul>
    <form @submit.prevent="addComment">
        <div class="field">
            <label for="comment">Add a comment</label>
            <input type="text" name="comment" v-model="newComment">
            <p v-if="feedback" class="red-text center"> {{ feedback }} </p>
        </div>
    </form>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'ViewProfile',

    data() {
        return {
            profile: null,
            newComment: null,
            feedback: null,
            user: null,
            comments: []
        }
    },
    created() {
        let ref = db.collection('users')

        // get current user
        ref.where('user_id', "==", firebase.auth().currentUser.uid).get()
        .then(snapshot => {
            // iterating through each snapshot and getting in into "doc"
            snapshot.forEach(doc => {
                this.user = doc.data() // storing doc.data into this.user
                this.user.id = doc.id // slug
            })
        })

        // getting one particular document and we need to pass an id into here which is slug
        // and we can get it from the route object
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data()
        })

        // comments
        db.collection('comments').where('to', "==", this.$route.params.id) // after third comma, thats an id of an profile walls we are in atm
        .onSnapshot((snapshot) => { // this function fires whenever something new happens in that collection
            snapshot.docChanges().forEach(change => { // for each change
                if(change.type == 'added') { // if change type is 'added'
                    this.comments.unshift({ // add it to the beggining of the array with "unshift"
                        from: change.doc.data().from, // from is a "property" from collection
                        content: change.doc.data().content
                    })  
                }
            })
        }) 
    },
    methods: {
        addComment() {
            if(this.newComment) {
                this.feedback = null
                db.collection('comments').add({
                    to: this.$route.params.id,
                    from: this.user.alias,
                    content: this.newComment,
                    time: Date.now()
                }).then(() => {
                    this.newComment = null // resseting new comment after one is added
                })
            } else {
                this.feedback = "you must enter a comment to add it"
            }
        }
    }
}
</script>

<style> 
.view-profile .card {
    padding: 20px;
    margin-top: 60px;
}
.view-profile h2{
    font-size: 2em;
    margin-top: 0;
}
.view-profile li {
    padding: 10px;
    border-bottom: 1px solid #eee;
}
</style>