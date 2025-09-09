#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bobyard.settings')  # settings module
    try:
        from django.core.management import execute_from_command_line  # cli entry
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Is it installed / venv active?"
        ) from exc
    execute_from_command_line(sys.argv)  # run commands

if __name__ == '__main__':
    main()  # start