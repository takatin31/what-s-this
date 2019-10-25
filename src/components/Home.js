import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import  ImagePicker from 'react-native-image-picker'
import firebase from 'react-native-firebase'


import { Actions } from 'react-native-router-flux';

const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
  apiKey: '9d94cae719934bffb1420af8e12c1e5e',
});

export default class Home extends React.Component {
  state = {
    name: '',
    page: 1,
    uri: '',
    lastPress: 0,
    timer: null, // variable timer utilisé par l'horloge pour le comptage du temps
    counter: 0 // compte le nombre de secondes écoulé
  };

  componentDidMount() {
    
  }

  uploadImage = (source)=> {

    var ref = firebase.storage().ref('Images').child('pic');
    // this.setState({ref: reff})
    
    
    ref.putFile(source).then(() => {
        ref.getDownloadURL()
        .then((url) => {
          clarifai.models.predict(Clarifai.GENERAL_MODEL, url, { maxConcepts: 3 }).
          then(response => {
            let pred = response["outputs"]["0"]["data"]["concepts"]["0"]["name"];
            this.setState({name: pred});
            this.setState({page: 2})
          })
        });
    }).catch((err) => {
        console.log(err);
    });

};


UploadPic = () => {

  var options = { // définier les options de la photo capturée
      title: 'Select Image',
      storageOptions: {
          skipBackup: true,
          path: 'images',
      }
  };
      // prendre une nouvelle photo (depuis la caméra ou la gallerie)
  ImagePicker.launchCamera(options, (response) => {
          console.log('Response = ', response);
      if (response.didCancel) { // si la requette a été annulé
          console.log('User cancelled image picker');
      }else if (response.error) { // si une erreur a été détecter
          console.log('ImagePicker Error: ', response.error);
      }else if (response.customButton) { // si un autre button a été cliqué dessus
          console.log('User tapped custom button: ', response.customButton);
      }else { // si aucun problème n'est survenu
          console.log('User selected a file form camera or gallery', response); 
          
          const data = new FormData(); // initialiser la variable data
          data.append('name', 'avatar'); // définier les champs
          data.append('fileData', { // définier le reste des champs
              uri : response.uri,
              type: response.type,
              name: response.fileName
          });
          
          const source = response.uri;
          
          this.setState({uri: source});
          //this.setState({page: 2})
          this.uploadImage(source);
         
      }
  }
  )
}

page2Press = () => {
  var delta = new Date().getTime() - this.state.lastPress;

    if(delta < 200) {
      // double tap happend
      clearInterval(this.state.timer); // arreter le compteur

    }else{
      let timer = setInterval(this.tick, 200); // initialiser la variable timer et lacer le compteur
      this.setState({timer}); // stocker la variable dans 'State'
    }

    this.setState({
      lastPress: new Date().getTime()
    })

    

    
}

tick =() => { // chaque tick d'horloge

    this.setState({// incrémenter le compteur
      counter: this.state.counter + 1
    });

    if (this.state.counter == 1){ // si le temps d'affichage de cette interface est écoulé

      
      clearInterval(this.state.timer); // arreter le compteur
      this.setState({page: 1});

    }

  }



  renderDetails(){
    if (this.state.page == 1){
      return(
          
            <TouchableOpacity style={styles.centeredViewStyle} onPress={this.UploadPic}>
                  <View  style={{justifyContent: 'center'}}>
                    <Image source={require('../images/camera.png')}
                    style={{width: 120, height: 100}}/>
                  </View>

                  <View style={{marginTop: -50}}>
                    <Text style={styles.middleTextstyle}>
                      - Please click on the Camera to take a picture.{"\n"}
                      - Image classification will be automaticlly activated.{"\n"}
                      - Result will be shown.
                    </Text>
                  </View>
            </TouchableOpacity>
          
    
      )
    }else if (this.state.page == 2){

      return(
        <TouchableWithoutFeedback onPress={this.page2Press}>
          <View style={{justifyContent: 'center', flex:1, width: '100%', height: '100%'}}>
            
            <View style={{justifyContent: 'center', paddingBottom: 60}}>
              <Image source={{uri: this.state.uri}}
                style={{width:'80%', aspectRatio: 1,alignSelf: 'center'}}/>

            </View>
              
            

            <View style={{backgroundColor: '#424242', elevation: 5, width: '80%',height:100, alignSelf: 'center', padding: 5, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 24, color: '#ffffff90'}}>
                {this.state.name}
              </Text>
            </View>


            

          </View>
        </TouchableWithoutFeedback>
      )
    }else{
      return(
            <TouchableOpacity style={styles.centeredViewStyle} onPress={this.page3Press}>
                  <View  style={{justifyContent: 'center'}}>
                    <Image source={require('../images/teamwork.png')}
                    style={{width: 120, height: 100}}/>
                  </View>

                  <View style={{marginTop: -50}}>
                    <Text style={styles.middleTextstyle}>
                      - You can ask other people about it.
                      - People can help You.
                    </Text>
                  </View>
            </TouchableOpacity>

      )
    }
  }


 

  render() {
    return (

      <View style={styles.viewStyle}>

        <View style={styles.headerView}>
          <Text style={styles.titleView}>
            Offline Mode
          </Text>
        </View>
        <View style={styles.middleViewStyle}>
          {this.renderDetails()}
        </View>
        
        
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  viewStyle:{
    backgroundColor: '#303030',
    flex: 1
  },
  headerView:{
    height: '10%',
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: "center"
  },
  titleView:{
    fontSize: 24,
    color: '#fff'
  },
  middleViewStyle:{
    height: '90%',
    backgroundColor: '#303030',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centeredViewStyle: {
    backgroundColor: '#424242',
    height: '50%',
    width: '80%',
    borderRadius: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 10,
    paddingLeft: 10,
    elevation: 10
  },
  middleTextstyle:{
    textAlign: 'center',
    color: '#ffffff90',
    fontSize: 18
  }
});
