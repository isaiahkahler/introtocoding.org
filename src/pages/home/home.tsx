import React, { useState, useEffect } from 'react';
import { styled, useTheme, Theme, withStyles } from '@material-ui/core/styles';
import Page from '../../components/page';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';

interface HomeProps {
    grade: number,
    progress: number,
    data: any
}

const StyledPaper = styled(Paper)((props: { theme: Theme }) => ({
    padding: props.theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}));


const StyledCircularProgressContainer = styled('div')(({ theme }) => ({
    height: '150px',
    width: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
}));

const StyledLink = styled(Link)(({theme}) => ({
    textDecoration: 'none',
    color: theme.palette.getContrastText(theme.palette.background.default),
}));

function Home(props: HomeProps) {

    const theme = useTheme();

    return (
        <Page title='Dashboard'>
            <Container maxWidth='lg' style={{ padding: theme.spacing(2) }}>
                <Grid container spacing={3}>
                    <Grid item xs>
                        <StyledPaper>
                            <Typography variant='h6'>Current Grade</Typography>
                            <StyledCircularProgressContainer>
                                <Typography variant='h5' style={{ position: 'absolute' }}>{props.grade}%</Typography>
                                <CircularProgress variant='static' value={props.grade} size='150px'></CircularProgress>
                            </StyledCircularProgressContainer>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs>
                        <StyledPaper>
                            <Typography variant='h6'>Progress</Typography>
                            <StyledCircularProgressContainer>
                                <Typography variant='h5' style={{ position: 'absolute' }}>{props.progress}%</Typography>
                                <CircularProgress variant='static' value={props.progress} size='150px'></CircularProgress>
                            </StyledCircularProgressContainer>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs>
                        <StyledPaper>
                            <Typography variant='h6'>Next Lesson</Typography>
                            <StyledLink to='/learning'>
                                <Typography variant='h5'>Click <strong>Here</strong> to Launch the Environment Demo!</Typography>
                            </StyledLink>

                        </StyledPaper>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default Home;