import { isFunction } from './equal'
import makeMapByString from './makeMap'

export const isEmptyString = (str: string): boolean => {
  // 包括单引号、双引号和空格混合的情况
  const regex = /^\s*$/
  // 去除所有单引号、双引号和空格
  const cleanedStr = str.replace(/['"\s]/g, '')
  return regex.test(cleanedStr)
}

export const isVariableName = (str: string): boolean => {
  const variableKeywords = makeMapByString(
    `true,false,null,undefined,NaN,Infinity,Object,Function,Boolean,Symbol,Number,Math,String,Date,Array,RegExp,Error,eval,arguments,this,super,yield,async,await,let,const,var,if,else,switch,case,default,while,do,for,break,continue,return,throw,try,catch,finally,with,delete,in,of,typeof,instanceof,void,new,import,from,as,export,extends,class,interface,implements,package,private,protected,public,static,constructor,prototype`
  )
  return !variableKeywords[str] && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str)
}

/**
 * Check the string like this '"string"' or "'string'"
 */
export const isQuotedString = (str: string): boolean => {
  const regex = /^(['"]).*\1$/
  return regex.test(str)
}

/**
 * "'string'" -> 'string' or '"string"' -> "string"
 */
export const normalQuotedString = (str: string): string => {
  return str.substring(1, str.length - 1)
}

export const stringToFunction = (str: string): Function => {
  return Function(`return ${str}`)
}

export const toJSON = (value: any): string => {
  const jsonString = JSON.stringify(value, (_, value) => {
    if (isFunction(value)) {
      return value.toString()
    }
    return value
  })
  return jsonString
}

export const formatPath = (path: string): string => {
  return path.replace(/\\/g, '/')
}
