import React, { useState, ReactElement, PropsWithChildren } from 'react';
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

const Root = styled('div')({
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
});

function Page(props: PropsWithChildren<any>) {

    const theme = useTheme();

    const StyledListItem = styled(ListItem)({
        marginRight: theme.spacing(2),
    });
    
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <Root>
            <AppBar>
                <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(!drawerOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" >
                        Dashboard
                </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClick={() => setDrawerOpen(false)}>
                <List>
                    <StyledListItem button>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText>Dashboard</ListItemText>
                    </StyledListItem>
                    <StyledListItem button>
                        <ListItemIcon><AssessmentIcon /></ListItemIcon>
                        <ListItemText>Grades</ListItemText>
                    </StyledListItem>
                    <StyledListItem button>
                        <ListItemIcon><AssignmentIcon /></ListItemIcon>
                        <ListItemText>Assignment</ListItemText>
                    </StyledListItem>
                </List>
            </Drawer>
            <div style={theme.mixins.toolbar} />
            {props.children}
        </Root>
    );
}

export default Page;