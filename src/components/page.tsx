import React, { useState, PropsWithChildren } from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { NavLink } from 'react-router-dom';


//review 
const Root = styled('div')(({theme}) => ({
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
}));

const StyledNavLink = styled(NavLink)(({theme}) => ({
    textDecoration: 'none',
    color: theme.palette.getContrastText(theme.palette.background.default),
}));

const StyledListItem = styled(ListItem)(({theme}) => ({
    marginRight: theme.spacing(2),
    backgroundColor: 'inherit'
}));

interface PageProps {
    title: string,
    noSpacer?: boolean,
}

function Page(props: PropsWithChildren<PageProps>) {

    const theme = useTheme();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const activeNavLinkStyle = {
        backgroundColor: theme.palette.action.selected, 
    };

    return (
        <Root>
            <AppBar>
                <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(!drawerOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" >
                        {props.title}
                </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClick={() => setDrawerOpen(false)}>
                <List>
                    <StyledNavLink to='/home' activeStyle={activeNavLinkStyle}>
                        <StyledListItem button>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText>Dashboard</ListItemText>
                        </StyledListItem>
                    </StyledNavLink>
                    <StyledNavLink to='/grades' activeStyle={activeNavLinkStyle}>
                        <StyledListItem button>
                            <ListItemIcon><AssessmentIcon /></ListItemIcon>
                            <ListItemText>Grades</ListItemText>
                        </StyledListItem>
                    </StyledNavLink>
                    <StyledNavLink to='/learning' activeStyle={activeNavLinkStyle}>
                        <StyledListItem button>
                            <ListItemIcon><AssignmentIcon /></ListItemIcon>
                            <ListItemText>Next Assignment</ListItemText>
                        </StyledListItem>
                    </StyledNavLink>
                </List>
            </Drawer>
            {!props.noSpacer && <div style={{...theme.mixins.toolbar, paddingTop: theme.spacing(1)}} />}
            
            {props.children}
        </Root>
    );
}

export default Page;