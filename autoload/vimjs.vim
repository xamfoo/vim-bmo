if exists('g:autoloaded_vimjs')
  finish
endif

let g:autoloaded_vimjs = 1

" if !exists('g:vimjs_executable')
"   let g:vimjs_executable = 'vimjs'
" endif

function! vimjs#start(...) abort
  if exists('a:1')
    let l:options = a:1
  else
    let l:options = {}
  endif
  
  " let l:port = get(l:options, 'port', '')
  let l:bin = get(l:options, 'bin', 'vimjs')

  let l:ch_options = {}
  let l:channel = ch_open(system(l:bin . ' start'), l:ch_options)
  " append(line('^'), ch_status(l:channel))
  " write hello-vimjs.txt
  " quitall!
endfunction
