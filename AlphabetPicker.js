import React, { Component, PropTypes } from 'react';
import { View, Text, PanResponder } from 'react-native';

const heightLetterBlock = 16

class LetterPicker extends Component {

    render() {
        return (
            <Text style={{ 
              height: heightLetterBlock, 
              width: 10, 
              textAlign: 'center', 
              lineHeight: heightLetterBlock,
              fontSize: 11, 
              fontFamily: 'Chevin-Bold', 
              color: '#53565A' 
            }}>
                {this.props.letter}
            </Text>
        );
    }
}

const Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
export default class AlphabetPicker extends Component {
    constructor(props, context) {
        super(props, context);
        if(props.alphabet){
            Alphabet = props.alphabet;
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e, gestureState) => {
//                 this.props.onTouchStart && this.props.onTouchStart();

//                 this.tapTimeout = setTimeout(() => {
//                     this._onTouchLetter(this._findTouchedLetter(gestureState.y0));
//                 }, 100);
            },
            onPanResponderMove: (evt, gestureState) => {
//                 clearTimeout(this.tapTimeout);
                this._onTouchLetter(this._findTouchedLetter(gestureState.moveY));
            },
            onPanResponderTerminate: this._onPanResponderEnd.bind(this),
            onPanResponderRelease: this._onPanResponderEnd.bind(this),
        });
    }

    _onTouchLetter(letter) {
        letter && this.props.onTouchLetter && this.props.onTouchLetter(letter);
    }

    _onPanResponderEnd() {
        requestAnimationFrame(() => {
            this.props.onTouchEnd && this.props.onTouchEnd();
        });
    }

    _findTouchedLetter(y) {
        let top = y - (this.absContainerTop || 0);

        if (top >= 1 && top <= this.containerHeight) {
          return Alphabet[parseInt(top / heightLetterBlock)]
        }
    }

    _onLayout(event) {
        this.refs.alphabetContainer.measure((x1, y1, width, height, px, py) => {
            this.absContainerTop = py;
            this.containerHeight = height;
        });
    }

    render() {
        this._letters = this._letters || (
            Alphabet.map((letter) => <LetterPicker letter={letter} key={letter} />)
        );

        return (
            <View
                ref='alphabetContainer'
                {...this._panResponder.panHandlers}
                onLayout={this._onLayout.bind(this)}
                style={{ 
                  marginRight: 10,
                  height: Alphabet.length * heightLetterBlock,
                  justifyContent: 'center',
                }}>
                <View>
                    {this._letters}
                </View>
            </View>
        );
    }

}
