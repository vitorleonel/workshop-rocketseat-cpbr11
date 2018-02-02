import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Keyboard, AsyncStorage, ToastAndroid } from 'react-native';

// or any pure javascript modules available in npm
import { Header, List, ListItem, FormInput, Button } from 'react-native-elements'; // 0.18.5

export default class App extends Component {
  
  state = {
    newTodoText: '',
    todos: []
  }
  
  componentDidMount() {
    this.getTodos()
  }
  
  addNewTodo = () => {
    if(this.state.newTodoText.length == 0) {
      return
    }
    
    let newTodo = {
      id: this.state.todos.length + 1,
      title: this.state.newTodoText,
      completed: false
    }
    
    this.setState({
      todos: [ ...this.state.todos,  newTodo ],
      newTodoText: ''
    }, () => {
      this.displayToast('Tarefa adicionada!')
      this.syncTodos()
    })
    
    Keyboard.dismiss()
  }
  
  toggleTodo = id => {
    const todos = this.state.todos.map(todo => {
      return todo.id === id ? { ...todo, completed: !todo.completed } : todo
    })
    
    this.setState({
      todos: todos
    }, () => this.syncTodos())
  }
  
  removeTodo = id => {
    const todos = this.state.todos.filter(todo => {
      return todo.id != id
    })
    
    this.setState({
      todos: todos
    }, () => {
      this.displayToast('Tarefa removida!')
      this.syncTodos()
    })
  }
  
  getTodos = async () => {
    const todos = await AsyncStorage.getItem('todos');
    
    if (todos) {
      this.setState({ todos: JSON.parse(todos) });
    }
  }
  
  syncTodos = () => {
    AsyncStorage.setItem('todos', JSON.stringify(this.state.todos))
  }
  
  displayToast = message => {
    ToastAndroid.show(message, ToastAndroid.SHORT)
  }
  
  render() {
    let items = this.state.todos.map(todo => (
      <ListItem title={todo.title} titleStyle={{
        textDecorationLine: todo.completed ? 'line-through' : 'none'
      }} hideChevron onPress={() => {this.toggleTodo(todo.id)}} onLongPress={() => this.removeTodo(todo.id)} key={todo.id} />
    ))
    
    // exibir a ScrollView caso existir items
    let listItems = null
    if(this.state.todos.length) {
      listItems = (
        <ScrollView>
          <List>
            { items }
          </List>
        </ScrollView>
      )
    }
    
    // desativar ou não o botão de adicionar
    let buttonDisable = true
    if(this.state.newTodoText.length > 0) {
      buttonDisable = false
    }
    
    return (
      <View style={styles.container}>
      
        <StatusBar barStyle="light-content" />
        <Header backgroundColor="#3498db" centerComponent={{ text: 'Campus Party Todo', style: { color: '#fff' } }} />
        
        <View style={{ marginVertical: 20 }}>
          <FormInput placeholder='Qual a nova tarefa a ser anotada?' value={this.state.newTodoText} onChangeText={ text => {this.setState({ newTodoText: text })} } />
          <Button title='Adicionar' backgroundColor="#3498db" style={{ marginTop: 10 }} onPress={this.addNewTodo} disabled={buttonDisable} />
        </View>
        
        { listItems }
        
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
