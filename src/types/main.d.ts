import { LoDashStatic } from 'lodash'
import { EventBus } from '@/plugins/event'
import Vue from 'vue'
import { Component } from 'vue-router/types/router'

declare global {
  const _: LoDashStatic
}

declare module 'vue/types/vue' {
  interface Vue {
    $bus: EventBus;
    $loading:({show, text}:({show:boolean, text?:string}))=>void
  }

  interface Component<V extends Vue>{
    loading?:boolean;
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
