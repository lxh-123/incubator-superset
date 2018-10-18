import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import DeckGLContainer from '../DeckGLContainer';
import { getExploreLongUrl } from '../../../explore/exploreUtils';
import layerGenerators from '../layers';

const propTypes = {
  formData: PropTypes.object.isRequired,
  payload: PropTypes.object.isRequired,
  setControlValue: PropTypes.func.isRequired,
  viewport: PropTypes.object.isRequired,
};

class DeckMulti extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { subSlicesLayers: {} };
  }

  componentDidMount() {
    const { formData, payload } = this.props;
    this.loadLayers(formData, payload);
  }

  componentWillReceiveProps(nextProps) {
    const { formData, payload } = nextProps;
    this.loadLayers(formData, payload);
  }

  loadLayers(formData, payload) {
    this.setState({ subSlicesLayers: {} });
    payload.data.slices.forEach((subslice) => {
      // Filters applied to multi_deck are passed down to underlying charts
      // note that dashboard contextual information (filter_immune_slices and such) aren't
      // taken into consideration here
      const filters = [
        ...(subslice.form_data.filters || []),
        ...(formData.filters || []),
        ...(formData.extra_filters || []),
      ];
      const subsliceCopy = {
        ...subslice,
        form_data: {
          ...subslice.form_data,
          filters,
        },
      };


function deckMulti(slice, payload, setControlValue) {
  const subSlicesLayers = {};
  const fd = slice.formData;
  const render = () => {
    const viewport = {
      ...fd.viewport,
      width: slice.width(),
      height: slice.height(),
    };
    const layers = Object.keys(subSlicesLayers).map(k => subSlicesLayers[k]);
    ReactDOM.render(
      <DeckGLContainer
        mapboxApiAccessToken={payload.data.mapboxApiKey}
        viewport={viewport}
        layers={layers}
        mapStyle={fd.mapbox_style}
        setControlValue={setControlValue}
      />,
      document.getElementById(slice.containerId),
    );
  };
  render();
  payload.data.slices.forEach((subslice) => {
    // Filters applied to multi_deck are passed down to underlying charts
    // note that dashboard contextual information (filter_immune_slices and such) aren't
    // taken into consideration here
    const filters = [
      ...(subslice.form_data.filters || []),
      ...(fd.filters || []),
      ...(fd.extra_filters || []),
    ];
    const subsliceCopy = {
      ...subslice,
      form_data: {
        ...subslice.form_data,
        filters,
      },
    };

export default DeckMulti;
