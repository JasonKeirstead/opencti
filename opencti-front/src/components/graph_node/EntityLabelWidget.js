import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose, head } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import inject18n from '../i18n';

const styles = () => ({
  item: {
    textAlign: 'center',
    padding: '5px 8px 5px 8px',
    backgroundColor: '#14262c',
    color: '#ffffff',
    pointerEvents: 'auto',
    cursor: 'pointer',
    fontSize: 12,
    '&:hover': {
      background: '#1e3f49',
    },
    position: 'relative',
    zIndex: 1500,
  },
});

class EntityLabelWidget extends Component {
  render() {
    const {
      t, nsd, classes, model, model: { extras },
    } = this.props;
    if (extras.length === 1) {
      const label = head(extras);
      return (
        <div className={classes.item} onClick={model.setSelected.bind(this, true)}>
          <strong>{t(`relation_${label.relationship_type}`)}</strong>
          {label.inferred === true ? <span><br/><em>{t('Inferred')}</em></span> : ''}
          {label.first_seen ? <span><br/>{nsd(label.first_seen)}<br/>{nsd(label.last_seen)}</span> : ''}
        </div>
      );
    }
    return (
      <div className={classes.item}>
        <strong>{extras.length} {t('relations')}</strong>
      </div>
    );
  }
}

EntityLabelWidget.propTypes = {
  model: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  nsd: PropTypes.func,
};

export default compose(
  inject18n,
  withStyles(styles),
)(EntityLabelWidget);
