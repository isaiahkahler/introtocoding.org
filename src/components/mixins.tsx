import {styled} from '@material-ui/core/styles';

export const ToolbarSpacer = styled('div')(({theme}) => ({
    ...theme.mixins.toolbar,
    // paddingTop: theme.spacing(1),
    // [theme.breakpoints.down('sm')]: {
    //     paddingTop: 0
    // }
}));