import { type FormKitTypeDefinition } from '@formkit/core'
import { createSection } from '@formkit/inputs'
import { token } from '@formkit/utils'
import { VaRadio, VaFormField } from 'vuestic-ui'
import { vuesticInputs } from '../features/vuesticInputs'


const radioInput = createSection('input', () => ({
  $cmp: 'VaFormField',
  props: {
    error: '$node.context.error',
    messages: '$node.context.help',
    errorMessages: '$node.context.errorMessages',
    loading: '$node.context.loading',
    dirty: '$node.context.state.validationVisible',
    label: '$node.context.label',
  },
  children: [
    {
      for: ['option', '$attrs.options'],
      $cmp: 'VaRadio',
      bind: '$attrs',
      props: {
        option: '$option',
        modelValue: '$node.context._value',
        'onUpdate:modelValue': '$node.context.node.input',
        onBlur: '$node.context.handlers.blur',
        disabled: '$node.context.disabled',
      }
    }
  ]
}))

/**
 * Input definition for a radio.
 * @public
 */
export const radio: FormKitTypeDefinition = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: radioInput(),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: 'input',
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: 'text',
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * A library of components to provide to the internal input schema
   */
  library: {
    VaFormField,
    VaRadio
  },
  /**
   * Additional features that should be added to your input
   */
  features: [vuesticInputs],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: token(),
}
