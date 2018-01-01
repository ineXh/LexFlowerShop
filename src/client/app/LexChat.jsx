import React from 'react';
import {render, View, TextInput} from 'react-dom';

import css from './../css/styles.css';
//,  FlatList
import AWS from 'aws-sdk/dist/aws-sdk-react-native'
//import AWS from 'aws-sdk/dist/aws-sdk.js'
// Initialize the Amazon Cognito credentials provider

const config = require('./../../../config/default.json');
//const config = require('config');
//console.log('config')
//console.log(config)

AWS.config.region = config.awsRegion; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.awsIdentityPoolId,
})
let lexRunTime = new AWS.LexRuntime()
let lexUserId = 'mediumBot' + Date.now()

let botName = "OrderFlowers";
let Chats=[];
let scrollStartPos = 0;
let scrollTop = 0;

class LexChat extends React.Component {

  constructor(props) {
    super(props);
    //console.log(props)
    this.state = {
    	userInput: '',
        messages: [
            /*{from: 'user', msg: 'a1'},
            {from: 'user', msg: 'a2'},
            {from: 'bot', msg: 'b1'},
            {from: 'bot', msg: 'b2'},
            {from: 'user', msg: 'a3'},
            {from: 'bot', msg: 'b3'}*/
        ],
        inputEnabled: true,
        text: 'placeholder',
        showMonitor: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClick = this.onClick.bind(this);

  }
  componentDidMount(){
    //console.log('componentDidMount')
    /*document.getElementById("chatmonitor").addEventListener("touchstart",
        function(event) {
            console.log('touchstart')
            scrollStartPos=scrollTop+event.touches[0].pageY*1.5;
            event.preventDefault();
        },false);

    document.getElementById("chatmonitor").addEventListener("touchmove",
        function(event) {
            console.log('touchmove')
            scrollTop=scrollStartPos-event.touches[0].pageY*1.5;
            event.preventDefault();
        },false);*/
  }
  onClick(event){
    let scrollBottom = this.scrollBottom.bind(this);
    let monitorState = this.state.showMonitor;
    this.setState({showMonitor: !monitorState},
        function(){
            if(!monitorState) scrollBottom();
        });
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  scrollBottom(){
    var mon = document.getElementById("chatmonitor");
    mon.scrollTop = mon.scrollHeight;
    //mon.scrollTop = mon.clientHeight;
  }
  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    var chatmsg = this.refs.chatmsg.value.trim();
    if (!chatmsg) return;
    //console.log(chatmsg)
    Chats.push(chatmsg)
    this.setState({messages: Chats})
    this.showRequest(chatmsg)

    
    this.refs.chatmsg.value = '';
  }

  // Sends Text to the lex runtime
    handleTextSubmit() {
        let inputText = this.state.userInput.trim()
        if (inputText !== '')
            this.showRequest(inputText)
    }
// Populates screen with user inputted message
    showRequest(inputText) {
        // Add text input to messages in state
        let oldMessages = Object.assign([], this.state.messages)
        oldMessages.push({from: 'user', msg: inputText})
        let scrollBottom = this.scrollBottom.bind(this);
        this.setState({
            messages: oldMessages,
            userInput: '',
            inputEnabled: false
        }, scrollBottom);
        this.sendToLex(inputText)

    }
// Responsible for sending message to lex
    sendToLex(message) {
    	//console.log('sendToLex')
    	//console.log(message)
        let params = {
            botAlias: '$LATEST',
            botName: botName,
            inputText: message,
            userId: lexUserId,
        }
        /*lexRunTime.postText(params, (err, data) => {
            if(err) {
                // TODO SHOW ERROR ON MESSAGES
            }
            if (data) {
                this.showResponse(data)
            }
        })*/
        var showResponse = this.showResponse.bind(this);
        lexRunTime.postText(params, function(err,data){
        	//console.log('postText callback function')
        	if(err) console.log(err)
        	if (data) {
        		//console.log(data);
        		showResponse(data)
        	}
        });
    }
showResponse(lexResponse) {
	//console.log('showResponse')
	//console.log(lexResponse)
        let lexMessage = lexResponse.message
        let oldMessages = Object.assign([], this.state.messages)
        oldMessages.push({from: 'bot', msg: lexMessage})
        let scrollBottom = this.scrollBottom.bind(this);
        this.setState({
            messages: oldMessages,
            inputEnabled: true
        }, scrollBottom);
       this.scrollBottom();
    }

  render() {

    return (
      <div>
        <h1>Lex Chat</h1>
        <h2>Sample Utterance: I want flowers.</h2>
        	{this.state.showMonitor ? this.renderChat() : null}
        <button id="chatbutton" onClick={this.onClick}>
        </button>
      </div>
    );
  } // end render
  renderChat(){
    var chatNodes = this.state.messages.map(function(message, index){
        return (
            <ChatListItem
              time  = {new Date()}
              msg   = {message.msg}
              author= {message.from}
              key   = {index}>
            </ChatListItem>
          );
        });
    return(
        <div id="chatwindow">
            <div id="chatmonitor">
                  {chatNodes}
            </div>
            <form onSubmit={this.handleSubmit}>
                <input id="chatinput" onChange={this.handleChange} type="text" ref="chatmsg"
                        placeholder="Type here..."/>
            </form>
        </div>
        );
  }
} // end LexChat



export default LexChat;


class ChatListItem extends React.Component {
  /*rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },*/
  constructor(props) {
    super(props);
	}
  render() {
    //var state = getGameState(this.props.state);//'GameRoom';
    //console.log(this.props)
    //console.log(this.props.key)
    var color = '#' + '0xFF9999'.toString(16);
    var time = convertTime(new Date(this.props.time));
    var msg =this.props.msg;
    //console.log(msg)
    var divStyle = {

    };
    var pStyle = {
        padding: '10px',
        borderRadius: '20px',
        whiteSpace: 'pre-wrap',
        maxWidth: '70%',
        display: 'inline-block',
    }
    if(this.props.author == 'user'){
        pStyle.backgroundColor = '#40AD4D'
        pStyle.color = 'white'
        pStyle.margin= '15px 5px 0px auto'
        pStyle.borderBottomRightRadius = '0px'
        pStyle.alignSelf = 'flex-start'
        pStyle.textAlign = 'right'
        pStyle.float= 'right';
        pStyle.clear= 'right';
    }else{
        pStyle.backgroundColor = 'white'
        pStyle.color = 'black'
        pStyle.margin= '15px auto 15px 5px'
        pStyle.borderBottomLeftRadius = '0px'
        pStyle.alignSelf = 'flex-end'
        pStyle.textAlign = 'left'
        pStyle.float= 'left';
        pStyle.clear= 'left';
    }
    return (
        <p style={pStyle}>{msg}</p>
    );
  }
}

var convertTime = function(time){
    var t = '' + (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());
    return t;
}


