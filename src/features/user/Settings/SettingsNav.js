import React, { Component } from 'react';
import { Grid, Header, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

class SettingsNav extends Component {
  render() {
    return (
      <Grid.Column>
          <Menu vertical>
            <Header icon="user" attached inverted color="grey" content="Profile" />
            <Menu.Item as={NavLink} to="/settings/basic">Basic</Menu.Item>
            <Menu.Item as={NavLink} to="/settings/about">About Me</Menu.Item>
            <Menu.Item as={NavLink} to="/settings/photos">My Photos</Menu.Item>
          </Menu>
          <Grid.Row />
          <Menu vertical>
            <Header
              icon="settings"
              attached
              inverted
              color="grey"
              content="Account"
            />
            <Menu.Item as={NavLink} to="/settings/account">My Account</Menu.Item>
          </Menu>
        </Grid.Column>
    )
  }
}

export default SettingsNav
