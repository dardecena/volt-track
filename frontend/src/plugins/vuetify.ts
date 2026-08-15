import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'voltTrack',
        themes: {
            voltTrack: {
                dark: false,
                colors: {
                    primary: '#4F46e5',
                    secondary: '#6366F1',
                    success: '#16A34A',
                    warning: '#D97706',
                    error: '#DC2626',
                    background: '#F8FAFC',
                    surface: '#FFFFFF',
                    'surface-variant': '#F1F5F9',
                    'on-surface-variant': '#64748B',
                },
            },
        },
    },
    defaults: {
        VCard: { elevation: 0, class: 'vt-card' },
        VBtn: { style: 'text-transform: none; font-weight: 600; letter-spacing: normal;' },
        VChip: { style: 'font-weight: 600;' },
    }
})