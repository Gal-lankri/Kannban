<template>
  <GoogleMap api-key="AIzaSyAV_zVjXKofPeV5nwAzfNKJ7Gt4VEMjHOw" style="width: 100%; height: 100%" :center="center"
    :zoom="12" :controlSize="20" :styles="styles">
    <MarkerCluster>
      <Marker v-for="(location, i) in locations" :options="{ position: location.position, title: location.title }"
        :key="i">
        <!-- <Marker :options="markerOptions"> -->
        <InfoWindow :open="true">
          <div id="content">
            <div id="siteNotice"></div>
            <h1 id="firstHeading" class="firstHeading">{{ location.taskTitle }}</h1>
            <div id="bodyContent">
              <p>{{ location.taskDesc }}</p>
            </div>
          </div>
        </InfoWindow>
      </Marker>
    </MarkerCluster>
  </GoogleMap>
</template>
<script>
import { GoogleMap, Marker, InfoWindow, MarkerCluster } from "vue3-google-map";
export default {
  name: '',
  props: [],
  components: { GoogleMap, Marker, InfoWindow, MarkerCluster },
  created() {

  },
  data() {
    return {
      center: { lat: 32.10729700940227, lng: 34.89875793457032 },
      styles: [
        {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        },
        {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "administrative.province",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
            {
              "saturation": "-39"
            },
            {
              "lightness": "35"
            },
            {
              "gamma": "1.08"
            }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
            {
              "saturation": "0"
            }
          ]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "all",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "lightness": "10"
            }
          ]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "lightness": "-14"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "lightness": "10"
            },
            {
              "gamma": "2.26"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "lightness": "-3"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "lightness": "54"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "lightness": "-7"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "all",
          "stylers": [
            {
              "saturation": "-100"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "lightness": "-2"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
            {
              "saturation": "-100"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "lightness": "100"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "saturation": "-100"
            },
            {
              "lightness": "-100"
            }
          ]
        }
      ]

    };
  },
  methods: {},
  computed: {
    locations() {
      const board = this.$store.getters.board

      const locations = []
      board.groups.forEach(group => {
        group.tasks.forEach(task => {
          if (task.location) {

            locations.push({ ...task })
          }
        })
      });

      // return locations
      console.log(locations)
    },

  },
  computed: {
    locations() {
      const board = this.$store.getters.board

      const locations = []
      board.groups.forEach(group => {
        group.tasks.forEach(task => {
          if (task.location) {
            const location = {

              'position': task.location.cords,
              'title': task.location.name,
              taskTitle: task.title,
              taskDesc: task.description
            }

            locations.push(location)
          }
        })
      });
      return locations
    },
  },
}
</script>
