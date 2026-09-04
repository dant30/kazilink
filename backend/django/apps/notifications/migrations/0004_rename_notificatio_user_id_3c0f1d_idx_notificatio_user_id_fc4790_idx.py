from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0003_align_notification_timestamp'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql="""
                    DO $$
                    BEGIN
                        IF to_regclass('notificatio_user_id_3c0f1d_idx') IS NOT NULL THEN
                            IF to_regclass('notificatio_user_id_fc4790_idx') IS NULL THEN
                                ALTER INDEX notificatio_user_id_3c0f1d_idx RENAME TO notificatio_user_id_fc4790_idx;
                            ELSE
                                DROP INDEX notificatio_user_id_3c0f1d_idx;
                            END IF;
                        ELSIF to_regclass('notificatio_user_id_fc4790_idx') IS NULL THEN
                            CREATE INDEX notificatio_user_id_fc4790_idx
                            ON notifications_notification (user_id, is_read, timestamp DESC);
                        END IF;
                    END $$;
                    """,
                    reverse_sql="""
                    DO $$
                    BEGIN
                        IF to_regclass('notificatio_user_id_fc4790_idx') IS NOT NULL
                           AND to_regclass('notificatio_user_id_3c0f1d_idx') IS NULL THEN
                            ALTER INDEX notificatio_user_id_fc4790_idx RENAME TO notificatio_user_id_3c0f1d_idx;
                        END IF;
                    END $$;
                    """,
                ),
            ],
            state_operations=[
                migrations.RenameIndex(
                    model_name='notification',
                    new_name='notificatio_user_id_fc4790_idx',
                    old_name='notificatio_user_id_3c0f1d_idx',
                ),
            ],
        ),
    ]
