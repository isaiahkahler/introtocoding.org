import React, { useState, useEffect } from 'react';
import { styled, useTheme, Theme, withStyles } from '@material-ui/core/styles';
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

const StyledPaper = styled(Paper)((props: { theme: Theme }) => ({
    padding: props.theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}));


const StyledCircularProgress = styled(({ ...props }) => {
    console.log({ ...props })
    return (
        <div style={{ position: 'relative' }}>
            <CircularProgress {...{ ...props, value: 100 }} style={{ color: "#ccc" }} >
            </CircularProgress>
            <CircularProgress {...props}>

            </CircularProgress>
        </div>

    )
})((props: { theme: Theme }) => ({
    position: "absolute"
}));

// const StyledCircularProgress = styled(({...other}) => {
//     console.log(other, 'hi?'); return(
// <CircularProgress size='50' variant='static' {...other}>

// </CircularProgress>
// )})((props: {theme: Theme}) => ({

// }));


function Home(props: HomeProps) {

    const theme = useTheme();

    // const StyledCircularProgress = createStyledCircularProgress(theme);

    const [gradeAnimation, setGradeAnimation] = useState(1);
    const [progressAnimation, setProgressAnimation] = useState(1);

    useEffect(() => {
        setTimeout(() => {
            setGradeAnimation(props.grade);
            setProgressAnimation(props.progress);

        }, 2000);
    }, []);


    return (
        <Page>
            <Container maxWidth='lg' style={{ padding: theme.spacing(2) }}>
                <Grid container spacing={3}>
                    <Grid item xs>
                        <StyledPaper>
                            <Typography variant='h6'>Current Grade</Typography>
                            {/* <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50%', padding: theme.spacing(1) }} >
                                <StyledCircularProgress size="50" variant='static' value={gradeAnimation} style={{transition: '2s'}} />
                                <Typography variant='h5' style={{ position: 'absolute' }}>{props.grade != null ? `${props.grade}%` : "N/A"}</Typography>
                            </span> */}
                        </StyledPaper>
                    </Grid>
                    <Grid item xs>
                        <StyledPaper>
                            <Typography variant='h6'>Progress</Typography>
                            <StyledCircularProgress variant='static' value={props.progress} />
                            {/* <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50%', padding: theme.spacing(1) }} >
                                <div style={{position: 'absolute'}}>
                                <StyledCircularProgress size="50" variant='static' value={100} style={{color: "#ccc"}} />

                                </div>
                                <div style={{position: 'absolute'}}>

                                <StyledCircularProgress size="50" variant='static' value={progressAnimation} />
                                </div>
                                <Typography variant='h5' style={{ position: 'absolute' }}>{props.progress}%</Typography>
                            </span> */}
                        </StyledPaper>
                    </Grid>
                    <Grid item xs>
                        <StyledPaper>
                            <Typography variant='h6'>Next Lesson</Typography>

                            <Typography variant='h5'>Something Here</Typography>

                        </StyledPaper>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default Home;