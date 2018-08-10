import { Route, RawLocation } from 'vue-router'
import Vue from 'vue'
import { getToken } from '@/auth' // getToken from cookie
import { middlewareFun } from '@/router/types'
export default ({to, from, next}:middlewareFun) => {
  if (getToken()) {
    next({ name: 'home' })
  } else {
    next()
  }
}
