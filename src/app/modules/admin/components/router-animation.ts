import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const routerAnimations = trigger('routerAnimations', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      style({
        position: 'absolute',
        // width: '100%',
        // height: '100%',
        left: 0,
        right: 0,
        willChange: 'transform, opacity'
      }),
      { optional: true }
    ),

    query(':leave', style({ opacity: 1, transform: 'translateY(0)' }), { optional: true }),
    query(':enter', style({ opacity: 0, transform: 'translateY(48px)' }), { optional: true }),
    group([
      query(
        ':leave',
        group([
          animate('0.4s cubic-bezier(0.25, .8, .25, 1)', style({ opacity: 0, transform: 'translateY(48px)' })),
          animateChild()
        ]),
        { optional: true }
      ),

      group([
        query(
          ':enter',
          group([
            animate('0.4s 150ms cubic-bezier(0.25, .8, .25, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
            animateChild()
          ]),
          { optional: true }
        )
      ])
    ])
  ])
]);
