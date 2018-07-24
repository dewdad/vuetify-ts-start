import { LoDashStatic } from 'lodash'
import { EventBus } from '@/plugins/event'
import Vue from 'vue'
import { Component } from 'vue-router/types/router'
import { Validator, ErrorBag } from 'vee-validate'

declare global {
  const _: LoDashStatic
}

declare module 'vue/types/vue' {
  interface Vue {
    $bus: EventBus;
    $loading:({show, text}:({show:boolean, text?:string}))=>void;
    $validator: Validator;
    errors: ErrorBag;
  }

  interface VueConstructor{
    layout?: string;
    loading?:boolean;
    middleware?:Function|string
  }

}

// ComponentOptions is declared in types/options.d.ts
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    layout?: string;
    loading?:boolean;
    middleware?:Function|string
  }
}

declare module 'vee-validate'
