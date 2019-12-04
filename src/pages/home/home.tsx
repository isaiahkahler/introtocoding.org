import React, { useState } from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import Page from '../../components/page';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

interface HomeProps {
    grade: number,
    progress: number,
    data: any
}

function Home(props: HomeProps) {

    const theme = useTheme();

    const StyledPaper = styled(Paper)({
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    });

    return (
        <Page>
            <Container maxWidth='lg' style={{ padding: theme.spacing(2) }}>
                <Grid container spacing={3}>
                    <Grid item xs>
                        <StyledPaper>
                            <Typography variant='h6'>Current Grade</Typography>
                            <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50%'}} >
                                <CircularProgress style={{width: '100%'}} variant='static' value={props.progress} />
                                <Typography style={{position: 'absolute'}}>{props.progress}</Typography>
                            </span>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs>
                        <StyledPaper>xs</StyledPaper>
                    </Grid>
                    <Grid item xs>
                        <StyledPaper>xs</StyledPaper>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default Home;