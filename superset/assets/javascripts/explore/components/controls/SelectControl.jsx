import React from 'react';
import PropTypes from 'prop-types';
import Select, { Creatable } from 'react-select';
import ControlHeader from '../ControlHeader';
import { t } from '../../../locales';

const propTypes = {
  choices: PropTypes.array,
  clearable: PropTypes.bool,
  description: PropTypes.string,
  freeForm: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  multi: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  showHeader: PropTypes.bool,
  optionRenderer: PropTypes.func,
  valueRenderer: PropTypes.func,
  valueKey: PropTypes.string,
  options: PropTypes.array,
};

const defaultProps = {
  choices: [],
  clearable: true,
  description: null,
  freeForm: false,
  isLoading: false,
  label: null,
  multi: false,
  onChange: () => {},
  onFocus: () => {},
  showHeader: true,
  optionRenderer: opt => opt.label,
  valueRenderer: opt => opt.label,
  valueKey: 'value',
};

// Handle `onPaste` so that users may paste in
// options as comma-delimited, slightly modified from
// https://github.com/JedWatson/react-select/issues/1672
function pasteSelect(props) {
  let pasteInput;
  return (
    <Select
      {...props}
      ref={(ref) => {
        // Creatable requires a reference to its Select child
        if (props.ref) {
          props.ref(ref);
        }
        pasteInput = ref;
      }}
      inputProps={{
        onPaste: (evt) => {
          if (!props.multi) {
            return;
          }
          evt.preventDefault();
          // pull text from the clipboard and split by comma
          const clipboard = evt.clipboardData.getData('Text');
          if (!clipboard) {
            return;
          }
          const values = clipboard.split(/[,]+/).map(v => v.trim());
          const options = values
            .filter(value =>
              // Creatable validates options
              props.isValidNewOption ? props.isValidNewOption({ label: value }) : !!value,
            )
            .map(value => ({
              [props.labelKey]: value,
              [props.valueKey]: value,
            }));
          if (options.length) {
            pasteInput.selectValue(options);
          }
        },
      }}
    />
  );
}
pasteSelect.propTypes = {
  multi: PropTypes.bool,
  ref: PropTypes.func,
};

export default class SelectControl extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { options: this.getOptions(props) };
    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.choices !== this.props.choices ||
        nextProps.options !== this.props.options) {
      const options = this.getOptions(nextProps);
      this.setState({ options });
    }
  }
  onChange(opt) {
    let optionValue = opt ? opt[this.props.valueKey] : null;
    // if multi, return options values as an array
    if (this.props.multi) {
      optionValue = opt ? opt.map(o => o[this.props.valueKey]) : null;
    }
    this.props.onChange(optionValue);
  }
  getOptions(props) {
    if (props.options) {
      return props.options;
    }
    // Accepts different formats of input
    const options = props.choices.map((c) => {
      let option;
      if (Array.isArray(c)) {
        const label = c.length > 1 ? c[1] : c[0];
        option = {
          value: c[0],
          label,
        };
      } else if (Object.is(c)) {
        option = c;
      } else {
        option = {
          value: c,
          label: c,
        };
      }
      return option;
    });
    if (props.freeForm) {
      // For FreeFormSelect, insert value into options if not exist
      const values = options.map(c => c.value);
      if (props.value) {
        let valuesToAdd = props.value;
        if (!Array.isArray(valuesToAdd)) {
          valuesToAdd = [valuesToAdd];
        }
        valuesToAdd.forEach((v) => {
          if (values.indexOf(v) < 0) {
            options.push({ value: v, label: v });
          }
        });
      }
    }
    return options;
  }
  render() {
    //  Tab, comma or Enter will trigger a new option created for FreeFormSelect
    const selectProps = {
      multi: this.props.multi,
      name: `select-${this.props.name}`,
      placeholder: t('Select %s', this.state.options.length),
      options: this.state.options,
      value: this.props.value,
      labelKey: 'label',
      valueKey: this.props.valueKey,
      autosize: false,
      clearable: this.props.clearable,
      isLoading: this.props.isLoading,
      onChange: this.onChange,
      onFocus: this.props.onFocus,
      optionRenderer: this.props.optionRenderer,
      valueRenderer: this.props.valueRenderer,
    };
    //  Tab, comma or Enter will trigger a new option created for FreeFormSelect
    const selectWrap = this.props.freeForm ? (
      <Creatable {...selectProps}>
        {pasteSelect}
      </Creatable>
    ) : (
      pasteSelect(selectProps)
    );
    return (
      <div>
        {this.props.showHeader &&
          <ControlHeader {...this.props} />
        }
        {selectWrap}
      </div>
    );
  }
}

SelectControl.propTypes = propTypes;
SelectControl.defaultProps = defaultProps;
