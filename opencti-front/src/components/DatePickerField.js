import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { InlineDatePicker } from 'material-ui-pickers';
import { dateFormat } from '../utils/Time';
import inject18n from './i18n';

class DatePickerField extends Component {
  render() {
    const {
      t, fld, fsd, md, fd, yd, nsd, field, form, onFocus, onSubmit, onChange, ...other
    } = this.props;
    const currentError = form.errors[field.name];
    return (
      <InlineDatePicker
        onlyCalendar={true}
        autoOk={true}
        keyboard={true}
        allowKeyboardControl={true}
        clearable={true}
        name={field.name}
        value={field.value}
        onFocus={() => {
          if (typeof onFocus === 'function') {
            onFocus(field.name);
          }
        }}
        onBlur={() => {
          form.setFieldTouched(
            field.name,
            true,
            true,
          );
        }}
        onKeyPress={(event) => {
          form.setFieldTouched(
            field.name,
            true,
            true,
          );
          if (typeof onSubmit === 'function' && event.key === 'Enter') {
            onSubmit(field.name, event.target.value);
          }
        }}
        onChange={(date) => {
          form.setFieldValue(
            field.name,
            date,
          );
          if (typeof onChange === 'function') {
            onChange(field.name, date);
          }
          if (typeof onSubmit === 'function') {
            onSubmit(field.name, dateFormat(date));
          }
        }}
        format='YYYY-MM-DD'
        helperText={form.errors[field.name] !== undefined && form.touched[field.name] ? currentError : ''}
        error={form.errors[field.name] !== undefined && form.touched[field.name]}
        onError={(_, error) => form.setFieldError(field.name, error)}
        {...other}
      />
    );
  }
}

DatePickerField.propTypes = {
  t: PropTypes.func.isRequired,
  field: PropTypes.object,
  form: PropTypes.object,
};

export default inject18n(DatePickerField);
