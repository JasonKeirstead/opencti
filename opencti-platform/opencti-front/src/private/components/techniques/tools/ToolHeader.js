import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import {
  compose, propOr, filter, append,
} from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { Add, Close } from '@material-ui/icons';
import inject18n from '../../../../components/i18n';
import TextField from '../../../../components/TextField';
import ToolPopover from './ToolPopover';
import { commitMutation } from '../../../../relay/environment';

const styles = () => ({
  title: {
    float: 'left',
    textTransform: 'uppercase',
  },
  popover: {
    float: 'left',
    marginTop: '-13px',
  },
  aliases: {
    float: 'right',
    overflowX: 'hidden',
    marginTop: '-5px',
  },
  alias: {
    marginRight: 7,
  },
  aliasInput: {
    margin: '4px 0 0 10px',
    float: 'right',
  },
});

const toolMutation = graphql`
  mutation ToolHeaderFieldMutation($id: ID!, $input: EditInput!) {
    toolEdit(id: $id) {
      fieldPatch(input: $input) {
        ...ToolHeader_tool
      }
    }
  }
`;

class ToolHeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { openAlias: false };
  }

  handleToggleCreateAlias() {
    this.setState({ openAlias: !this.state.openAlias });
  }

  onSubmitCreateAlias(data) {
    if (
      this.props.tool.alias === null
      || !this.props.tool.alias.includes(data.new_alias)
    ) {
      commitMutation({
        mutation: toolMutation,
        variables: {
          id: this.props.tool.id,
          input: {
            key: 'alias',
            value: append(data.new_alias, this.props.tool.alias),
          },
        },
      });
    }
    this.handleToggleCreateAlias();
  }

  deleteAlias(alias) {
    const aliases = filter(a => a !== alias, this.props.tool.alias);
    commitMutation({
      mutation: toolMutation,
      variables: {
        id: this.props.tool.id,
        input: { key: 'alias', value: aliases },
      },
    });
  }

  render() {
    const {
      t, classes, variant, tool,
    } = this.props;
    return (
      <div>
        <Typography
          variant="h1"
          gutterBottom={true}
          classes={{ root: classes.title }}
        >
          {tool.name}
        </Typography>
        <div className={classes.popover}>
          <ToolPopover toolId={tool.id} />
        </div>
        {variant !== 'noalias' ? (
          <div className={classes.aliases}>
            {propOr([], 'alias', tool).map(label => (label.length > 0 ? (
                <Chip
                  key={label}
                  classes={{ root: classes.alias }}
                  label={label}
                  onDelete={this.deleteAlias.bind(this, label)}
                />
            ) : (
              ''
            )))}
            <IconButton
              color="secondary"
              aria-label="Alias"
              onClick={this.handleToggleCreateAlias.bind(this)}
            >
              {this.state.openAlias ? (
                <Close fontSize="small" />
              ) : (
                <Add fontSize="small" />
              )}
            </IconButton>
            <Slide
              direction="left"
              in={this.state.openAlias}
              mountOnEnter={true}
              unmountOnExit={true}
            >
              <Formik
                initialValues={{ new_alias: '' }}
                onSubmit={this.onSubmitCreateAlias.bind(this)}
                render={() => (
                  <Form style={{ float: 'right' }}>
                    <Field
                      name="new_alias"
                      component={TextField}
                      autoFocus={true}
                      placeholder={t('New alias')}
                      className={classes.aliasInput}
                    />
                  </Form>
                )}
              />
            </Slide>
          </div>
        ) : (
          ''
        )}
        <div className="clearfix" />
      </div>
    );
  }
}

ToolHeaderComponent.propTypes = {
  tool: PropTypes.object,
  variant: PropTypes.string,
  classes: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
};

const ToolHeader = createFragmentContainer(ToolHeaderComponent, {
  tool: graphql`
    fragment ToolHeader_tool on Tool {
      id
      name
      alias
    }
  `,
});

export default compose(
  inject18n,
  withStyles(styles),
)(ToolHeader);