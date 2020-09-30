<template>
    <div class="map">
        <div class="google-map" id="map"></div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'GMap',
    data() {
        return {
            lat: 53,
            lng: -2
        }
    },
    methods: {
        renderMap() {
            /// We creating this function to create a google map and placing it in the element
            const map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: this.lat, lng: this.lng },
                zoom: 6,
                maxZoom: 15,
                minZoom: 3,
                streetViewControl:false
            })
            // getting users from collection
            db.collection('users').get().then(users => {
                // getting inside users and iterating through each of them and taking them as an doc
                users.docs.forEach(doc => {
                    let data = doc.data() // data() --- how we get the data stored inside each document
                    if(data.geolocation) { // if geolocation is not null
                        let marker = new google.maps.Marker({ // place the marker
                            position: {
                                lat: data.geolocation.lat,
                                lng: data.geolocation.lng
                            },
                            // placing the marker on the "map"
                            map: map // can be just  -- map
                        })
                        // add click event to marker
                        marker.addListener('click', () => {
                            // taking to the users wall 
                            this.$router.push({ name: 'ViewProfile', params: { id: doc.id }}) // passing the parameter to go /profile/ doc.id -- which we already had
                        })
                    }
                })
            })
        }
    },
    
    mounted() {
        // get current user
        let user = firebase.auth().currentUser


        // get user geolocation
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                // callback function, taking parameters from it and updating them in data() function
                this.lat = pos.coords.latitude
                this.lng = pos.coords.longitude

                // find the user records and then update geocoords for him
                db.collection('users').where('user_id', '==', user.uid).get()
                .then(snapshot => {
                    snapshot.forEach((doc) => {
                        db.collection('users').doc(doc.id).update({
                            geolocation: {
                                lat: pos.coords.latitude,
                                lng: pos.coords.longitude

                            }
                        })
                    })
                }).then(() => {
                    this.renderMap()
                })

                this.renderMap()
            }, (err) => {
                console.log(err)
                this.renderMap()
            }, { maximumAge: 60000, timeout: 3000}) /* checking user location within 1 hour and then if after 3 second we couldnt find it
             it consoles the error */
            // up until here its only in success case
        } else {
            // position center by default values
            this.renderMap()
        }
    }
}
</script>

<style>
.google-map {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    position: absolute;
    left: 0;
}
</style>