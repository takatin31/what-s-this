import React from 'react';
import {
  Platform,
  ScrollView,
  Dimensions,
  View
} from 'react-native';

import { Router, Scene, ActionConst } from 'react-native-router-flux';
import Home from './src/components/Home';
//import Chat from './src/components/Chat';

import enterRoom from "./src/chataudio/enterRoom";
import Chat from "./src/chataudio/chat";
import Backend from './src/Backend2';

console.disableYellowBox = true;

const  deviceWidth = Dimensions.get('window').width;

export default class App extends React.Component {

  state={
    selectedIndex: 0,
    user: this.enterRoom(),
    slides: [],
  }

  componentWillMount(){
    let slides = [<Home goOnline={() => this.refs.scrollView.scrollToEnd()}/>, <Chat user={this.state.user}/>];
    this.setState({slides: slides});
  }

  enterRoom() {

    let uid = Backend.getUid();
    const user = {
        _id: `${uid}`,
        name: `${uid}`,
        firstName: `${uid}`.substring(0, `${uid}`.length/2 - 1),
        lastName: `${uid}`.substring(`${uid}`.length/2 , `${uid}`.length-1),
        roomName: `${uid}`,
        avatar: `https://upload.wikimedia.org/wikipedia/commons/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg`
    }
    return user;
  }

  renderViews(){

    return this.state.slides.map((value, i) =>
        <View key={i} style={{width: deviceWidth}}>
            {value}
        </View>
    );

  }

  setSelectedIndex = event =>{

    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffset/deviceWidth);
    this.setState({selectedIndex: index});
    console.log(this.state.selectedIndex)
}

// render() {
//   return (
//     <Router>
//       <Scene key={"ROOT_SCENE"} panHandlers={null} passProps>
//         <Scene
//           key={"enterRoom"}
//           component={enterRoom}
//           hideNavBar
//           type={ActionConst.RESET}
//         />
//         <Scene
//           key={"chat"}
//           component={chat}
//           hideNavBar
//           type={ActionConst.RESET}
//         />
//       </Scene>
//     </Router>
//   );

  render() {
    return (
      <View style={{flex: 1}}>
          <ScrollView ref={'scrollView'} horizontal pagingEnabled scrollEventThrottle={16} onScroll={this.setSelectedIndex}>
                          {this.renderViews()}
        </ScrollView>
      </View>
      

      // <Router>
      //   <Scene key='root' style={{paddingTop: Platform.OS === 'ios' ? 64 : 54}}>
      //     <Scene key='home' title='Home' component={Home}/>
      //     <Scene key='chat' title='Chat' component={Chat}/>
      //   </Scene>
      // </Router>
      
    );
  }
}

