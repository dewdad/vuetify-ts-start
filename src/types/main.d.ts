import { LoDashStatic } from 'lodash'
import { EventBus } from '@/plugins/event'
import Vue from 'vue'

declare global {
  const _: LoDashStatic
}

declare module 'vue/types/vue' {
  interface Vue {
    $bus: EventBus;
    $loading:({show, text}:({show:boolean, text?:string}))=>void
  }

}

// ComponentOptions is declared in types/options.d.ts
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
layout?: string;
  }
}
