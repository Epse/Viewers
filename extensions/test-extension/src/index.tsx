import { PanelService, Types, MeasurementService } from '@ohif/core';
import { ProbeTool, ArrowAnnotateTool } from '@cornerstonejs/tools';
import { ViewportGridService } from '@ohif/core';

import { id } from './id';

import hpTestSwitch from './hpTestSwitch';

import getCustomizationModule from './getCustomizationModule';
// import {setViewportZoomPan, storeViewportZoomPan } from './custom-viewport/setViewportZoomPan';
//import sameAs from './custom-attribute/sameAs';
//import numberOfDisplaySets from './custom-attribute/numberOfDisplaySets';
//import maxNumImageFrames from './custom-attribute/maxNumImageFrames';
import React from 'react';
import { Label, Button } from '@ohif/ui-next';

/**
 * The test extension provides additional behaviour for testing various
 * customizations and settings for OHIF.
 */
const testExtension: Types.Extensions.Extension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id,

  /** Register additional behaviour:
   *   * HP custom attribute seriesDescriptions to retrieve an array of all series descriptions
   *   * HP custom attribute numberOfDisplaySets to retrieve the number of display sets
   *   * HP custom attribute numberOfDisplaySetsWithImages to retrieve the number of display sets containing images
   *   * HP custom attribute to return a boolean true, when the attribute sameAttribute has the same
   *     value as another series description in an already matched display set selector named with the value
   *     in `sameDisplaySetId`
   */
  preRegistration: (_: Types.Extensions.ExtensionParams) => {
    /*
    const { hangingProtocolService } = servicesManager.services;
    hangingProtocolService.addCustomAttribute(
      'numberOfDisplaySets',
      'Number of displays sets',
      numberOfDisplaySets
    );
    hangingProtocolService.addCustomAttribute(
      'maxNumImageFrames',
      'Maximum of number of image frames',
      maxNumImageFrames
    );
    hangingProtocolService.addCustomAttribute(
      'sameAs',
      'Match an attribute in an existing display set',
      sameAs
    );

     */
    //const measurementService: MeasurementService = servicesManager.services.MeasurementService;
    // How does render???
    //const measurementSource = measurementService.createSource(
    //  MEASUREMENT_SOURCE,
    //  MEASUREMENT_VERSION
    //);
  },
  onModeEnter: ({ servicesManager }) => {},

  /** Registers some customizations */
  getCustomizationModule,

  getHangingProtocolModule: () => {
    return [
      // Create a MxN hanging protocol available by default
      {
        name: hpTestSwitch.id,
        protocol: hpTestSwitch,
      },
    ];
  },

  getPanelModule: params => {
    // TODO need a way to programatically turn on measurement tracking
    const onCreateBtn = () => {
      const measurementService: MeasurementService =
        params.servicesManager.services.MeasurementService;
      const viewportGridService: ViewportGridService =
        params.servicesManager.services.viewportGridService;
      // In theory I might be able to turn the resulting annotaiton into a measurement...
      // This _should_ return an annotation but apparently not?
      ProbeTool.hydrate(viewportGridService.getActiveViewportId(), [[0, 100, 100]]);

      const measurements = measurementService.getMeasurements();
      const measurement = measurements[measurements.length - 1];

      //const source = measurementService.getSource('Cornerstone3DTools', '0.1');
      //const mappings = measurementService.getSourceMappings('Cornerstone3DTools', '0.1');
      //const mapping = mappings.find(m => m.annotationType == 'Probe');

      // const id = measurementService.addRawMeasurement(
      //   source,
      //   'Probe',
      //   {
      //     annotation: annotation,
      //   },
      //   mapping.toMeasurementSchema
      // );
      // const measurement = measurementService.getMeasurement(id);
      if (measurement) {
        //measurement.label = 'autogen measurement';
        measurement.displayText = {
          primary: ['Primary'],
          secondary: ['Secondary'],
        };
        measurementService.update(measurement.uid, measurement, true);
        console.log(measurement);
      } else {
        console.error('No measurement!');
      }

      ArrowAnnotateTool.hydrate(viewportGridService.getActiveViewportId(), [[0, 100, 100], [0, 200, 200]], 'placeholder');
    };
    const onLogBtn = () => {
      const measurementService: MeasurementService =
        params.servicesManager.services.MeasurementService;
      console.log(measurementService.getMeasurements());
    };
    const panel = () => {
      return (
        <div>
          <Label>Measurement Tools</Label>
          <Button onClick={_e => onCreateBtn()}>Create</Button>
          <Button onClick={_e => onLogBtn()}>Log</Button>
        </div>
      );
    };

    return [
      {
        name: 'placeholder',
        iconName: 'icon-patient',
        iconLabel: 'Placeholder',
        component: panel,
      },
    ];
  },
};

export default testExtension;
