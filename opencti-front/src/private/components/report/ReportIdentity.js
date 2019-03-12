import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, pathOr } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import inject18n from '../../../components/i18n';
import ItemStatus from '../../../components/ItemStatus';

const styles = theme => ({
  paper: {
    minHeight: '100%',
    margin: '10px 0 0 0',
    padding: '15px',
    backgroundColor: theme.palette.paper.background,
    color: theme.palette.text.main,
    borderRadius: 6,
  },
});

class ReportIdentityComponent extends Component {
  render() {
    const {
      t, fld, classes, report,
    } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Typography variant='h4' gutterBottom={true}>
          {t('Identity')}
        </Typography>
        <Paper classes={{ root: classes.paper }} elevation={2}>
          <Typography variant='h3' gutterBottom={true}>
            {t('Publication date')}
          </Typography>
          {fld(report.published)}
          <Typography variant='h3' gutterBottom={true} style={{ marginTop: 20 }}>
            {t('Author')}
          </Typography>
          {pathOr('-', ['createdByRef', 'node', 'name'], report)}
          <Typography variant='h3' gutterBottom={true} style={{ marginTop: 20 }}>
            {t('Processing state')}
          </Typography>
          <ItemStatus label={t(`${report.object_status ? `report_status_${report.object_status}` : 'report_status_0'}`)} status={report.object_status}/>
          <Typography variant='h3' gutterBottom={true} style={{ marginTop: 20 }}>
            {t('Confidence level')}
          </Typography>
          {t(`${report.source_confidence_level ? `confidence_${report.source_confidence_level}` : 'confidence_unknown'}`)}
          </Paper>
      </div>
    );
  }
}

ReportIdentityComponent.propTypes = {
  report: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
};

const ReportIdentity = createFragmentContainer(ReportIdentityComponent, {
  report: graphql`
      fragment ReportIdentity_report on Report {
          id
          published
          object_status
          source_confidence_level
          createdByRef {
              node {
                  name
              }
          }
      }
  `,
});

export default compose(
  inject18n,
  withStyles(styles),
)(ReportIdentity);
