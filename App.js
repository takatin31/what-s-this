import React from 'react';
import {
  Platform,
  ScrollView,
  Dimensions,
  View
} from 'react-native';

import { Router, Scene, ActionConst } from 'react-native-router-flux';
import Home from './src/components/Home';
import Chat from './src/components/Chat';

import enterRoom from "./src/chataudio/enterRoom";
import chat from "./src/chataudio/chat";

console.disableYellowBox = true;

const  deviceWidth = Dimensions.get('window').width;

export default class App extends React.Component {

  state={
    selectedIndex: 0,
    slides: [<Home/>, <Chat/>],
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

render() {
  return (
    <Router>
      <Scene key={"ROOT_SCENE"} panHandlers={null} passProps>
        <Scene
          key={"enterRoom"}
          component={enterRoom}
          hideNavBar
          type={ActionConst.RESET}
        />
        <Scene
          key={"chat"}
          component={chat}
          hideNavBar
          type={ActionConst.RESET}
        />
      </Scene>
    </Router>
  );

  // render() {
  //   return (
  //     <View style={{flex: 1}}>
  //         <ScrollView horizontal pagingEnabled scrollEventThrottle={16} onScroll={this.setSelectedIndex}>
  //                         {this.renderViews()}
  //       </ScrollView>
  //     </View>
      

  //     // <Router>
  //     //   <Scene key='root' style={{paddingTop: Platform.OS === 'ios' ? 64 : 54}}>
  //     //     <Scene key='home' title='Home' component={Home}/>
  //     //     <Scene key='chat' title='Chat' component={Chat}/>
  //     //   </Scene>
  //     // </Router>
      
  //   );
  // }
}
}
